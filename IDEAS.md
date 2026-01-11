# Agent-Native Architecture for Voice Support
## Implementation Plan

---

## Executive Summary

This document outlines how to evolve the current **simulation-based voice support demo** into a production-ready **agent-native application** while preserving what works: human-in-the-loop validation, Supabase storage, and use case specialization.

**Core Philosophy:**
- **Agents for intelligence**: Field extraction, categorization, follow-up questions
- **Humans for validation**: Review, completion, final approval
- **Database for persistence**: Tickets stay in Supabase
- **Files for transparency**: Agent reasoning, transcripts, session state

**Expected Outcomes:**
- Replace hardcoded extraction with Claude-powered tools
- Enable new use cases without code changes (just prompts)
- Support emergent capabilities (email tickets, pattern analysis)
- Maintain sub-3-second extraction latency

---

## Current State Analysis

### What Works Well (Keep)

✅ **Human-in-the-Loop Flow**
```
Recording → Validation Form → Confirmation
```
This is a feature, not a limitation. Agent assists, human decides.

✅ **Supabase for Tickets**
```sql
-- 45+ field schema with RLS, indexes, real-time
-- Perfect for relational queries, ticket search
```
Files would be worse here.

✅ **Use Case Specialization**
```javascript
// Different fields per use case
IT Support:    device, symptoms, frequency
E-commerce:    order_number, product_description
SaaS:          feature, steps_to_reproduce
Dev Portal:    request_type, context
```
Agent prompts should embrace this, not fight it.

### What Needs Transformation

❌ **Hardcoded Field Extraction**
```javascript
// transcriptions.js:10-16
mapping: {
  device: 'PC gaming avec RTX',
  symptoms: 'écran qui freeze'
}
```
→ Replace with Claude tool calls

❌ **Static Follow-up Questions**
```javascript
// Pass 1 questions hardcoded
// Pass 2 questions hardcoded
```
→ Agent generates contextual follow-ups

❌ **Random Agent Assignment**
```javascript
// confirmation.jsx - Math.random()
```
→ Agent recommends based on ticket attributes

❌ **No Reasoning Visibility**
```javascript
// User sees extracted fields
// Doesn't see WHY they were extracted
```
→ Add extraction logs and confidence scores

---

## Phased Implementation

### Phase 1: Foundation (Week 1-2)
**Goal:** Add Claude, maintain current UX exactly

#### 1.1 Add Claude SDK
```bash
npm install @anthropic-ai/sdk
```

#### 1.2 Create Agent Service Layer
```javascript
// src/services/agent.js

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // or proxy through backend
});

export class VoiceSupportAgent {
  constructor(useCase, language) {
    this.useCase = useCase;
    this.language = language;
    this.messages = [];
    this.extractedFields = {};
    this.extractionLog = [];
  }

  async extractFromTranscript(transcript) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: this.getSystemPrompt(),
      tools: this.getTools(),
      messages: [
        ...this.messages,
        {
          role: "user",
          content: `Extract support ticket information from this transcript:\n\n${transcript}`
        }
      ]
    });

    return this.processResponse(response);
  }

  getSystemPrompt() {
    const useCaseConfig = useCases[this.useCase];
    return `You are a support ticket extraction specialist for ${useCaseConfig.title}.

Your job is to extract structured information from voice transcripts.

## Available Fields
${useCaseConfig.fields.map(f => `- ${f.key}: ${f.label} (${f.required ? 'required' : 'optional'})`).join('\n')}

## Extraction Guidelines
- Be precise: Only extract information explicitly stated
- Be confident: If uncertain about a field value, don't extract it
- Be thorough: Look for all relevant fields in the transcript
- Language: Transcript is in ${this.language}, preserve original wording

## Output Format
Use the extract_field tool for each field you identify.
Use the request_clarification tool for missing required fields.
Use the complete_extraction tool when finished.`;
  }

  getTools() {
    return [
      {
        name: "extract_field",
        description: "Extract a single field value from the transcript",
        input_schema: {
          type: "object",
          properties: {
            field_name: {
              type: "string",
              description: "The field key (e.g., 'device', 'symptoms')"
            },
            field_value: {
              type: "string",
              description: "The extracted value from the transcript"
            },
            confidence: {
              type: "number",
              description: "Confidence score 0-1"
            },
            source_quote: {
              type: "string",
              description: "Exact quote from transcript supporting this extraction"
            }
          },
          required: ["field_name", "field_value", "confidence", "source_quote"]
        }
      },
      {
        name: "request_clarification",
        description: "Request clarification for a missing required field",
        input_schema: {
          type: "object",
          properties: {
            field_name: {
              type: "string",
              description: "The missing field key"
            },
            question: {
              type: "string",
              description: "Natural follow-up question to ask the user"
            },
            context: {
              type: "string",
              description: "Why this field is important"
            }
          },
          required: ["field_name", "question"]
        }
      },
      {
        name: "complete_extraction",
        description: "Signal that extraction is complete",
        input_schema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["complete", "needs_clarification"],
              description: "Whether all required fields were extracted"
            },
            summary: {
              type: "string",
              description: "Brief summary of what was extracted"
            }
          },
          required: ["status", "summary"]
        }
      }
    ];
  }

  async processResponse(response) {
    // Handle tool calls and update internal state
    for (const content of response.content) {
      if (content.type === 'tool_use') {
        switch (content.name) {
          case 'extract_field':
            this.extractedFields[content.input.field_name] = {
              value: content.input.field_value,
              confidence: content.input.confidence,
              source: content.input.source_quote,
              timestamp: new Date().toISOString()
            };
            this.extractionLog.push({
              action: 'extract',
              field: content.input.field_name,
              reasoning: content.input.source_quote
            });
            break;

          case 'request_clarification':
            this.extractionLog.push({
              action: 'clarify',
              field: content.input.field_name,
              question: content.input.question
            });
            break;

          case 'complete_extraction':
            return {
              status: content.input.status,
              fields: this.extractedFields,
              log: this.extractionLog,
              summary: content.input.summary
            };
        }
      }
    }

    // Continue conversation if not complete
    this.messages.push(
      { role: "user", content: response.content },
      { role: "assistant", content: response.content }
    );

    return { status: 'processing', fields: this.extractedFields };
  }
}
```

#### 1.3 Update Recording.jsx
```javascript
// Replace hardcoded mapping with agent extraction

const [agent] = useState(() => new VoiceSupportAgent(useCase, language));
const [extractionLog, setExtractionLog] = useState([]);

// After transcript finishes
const handleTranscriptComplete = async () => {
  setIsProcessing(true);

  const result = await agent.extractFromTranscript(currentTranscript);

  setAnswers(result.fields);
  setExtractionLog(result.log);
  setIsProcessing(false);

  if (result.status === 'complete') {
    // Move to validation
  } else if (result.status === 'needs_clarification') {
    // Show follow-up questions
  }
};
```

#### 1.4 Success Criteria
- [ ] Claude extracts fields with ≥90% accuracy vs hardcoded mappings
- [ ] Extraction completes in <3 seconds
- [ ] Existing UI flow unchanged from user perspective
- [ ] All 4 use cases working with same agent code

---

### Phase 2: Transparency (Week 3)
**Goal:** Show users WHY fields were extracted

#### 2.1 Add Extraction Log UI
```javascript
// New component: src/components/ExtractionLog.jsx

export function ExtractionLog({ log, fields }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold mb-2">
        Extraction Reasoning
      </h3>
      {Object.entries(fields).map(([key, data]) => (
        <div key={key} className="mb-2 text-sm">
          <span className="font-medium">{key}:</span>
          <span className="ml-2">{data.value}</span>
          {data.confidence < 0.8 && (
            <span className="ml-2 text-yellow-600">
              (Low confidence: {(data.confidence * 100).toFixed(0)}%)
            </span>
          )}
          <div className="text-gray-600 text-xs mt-1 italic">
            "{data.source}"
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 2.2 Update Validate.jsx
```javascript
// Show extraction log alongside validation form
<Validate
  ticket={ticket}
  extractionLog={extractionLog}
  onUpdate={handleFieldUpdate}
/>
```

#### 2.3 Add Confidence-Based UI Hints
```javascript
// In form fields
{field.confidence < 0.7 && (
  <div className="text-yellow-600 text-xs">
    Please verify - agent was unsure about this field
  </div>
)}
```

#### 2.4 Success Criteria
- [ ] Users can see source quotes for each extracted field
- [ ] Low confidence fields are visually flagged
- [ ] Extraction reasoning helps users validate faster

---

### Phase 3: Parity (Week 4)
**Goal:** Whatever users can do in UI, agent can do via tools

#### 3.1 Capability Audit
| User Action (Validate.jsx) | Current | Agent Tool Needed |
|----------------------------|---------|-------------------|
| Edit field value | ✅ Input field | `update_field()` |
| Mark field uncertain | ❌ None | `flag_uncertain()` |
| Change category | ✅ Dropdown | `recategorize()` |
| Change priority | ✅ Dropdown | `set_priority()` |
| Add/remove tags | ✅ Tag selector | `add_tag()` / `remove_tag()` |
| Add note | ✅ Textarea | `add_note()` |
| Request human review | ❌ None | `request_review()` |

#### 3.2 Add Agent Edit Tools
```javascript
// Extend agent.getTools() with:
{
  name: "update_field",
  description: "Update an extracted field value",
  input_schema: {
    type: "object",
    properties: {
      field_name: { type: "string" },
      new_value: { type: "string" },
      reason: { type: "string", description: "Why this update is needed" }
    },
    required: ["field_name", "new_value", "reason"]
  }
},
{
  name: "flag_uncertain",
  description: "Flag a field as needing human attention",
  input_schema: {
    type: "object",
    properties: {
      field_name: { type: "string" },
      reason: { type: "string" },
      suggested_question: { type: "string" }
    },
    required: ["field_name", "reason"]
  }
},
{
  name: "recategorize",
  description: "Change ticket category based on content analysis",
  input_schema: {
    type: "object",
    properties: {
      new_category: { type: "string", enum: ["hardware", "software", "network", "other"] },
      reasoning: { type: "string" }
    },
    required: ["new_category", "reasoning"]
  }
}
```

#### 3.3 Success Criteria
- [ ] Agent can perform all validation actions users can
- [ ] Agent actions are suggestions, user has final say
- [ ] No "orphan UI actions" that agent can't replicate

---

### Phase 4: Dynamic Follow-ups (Week 5-6)
**Goal:** Agent generates contextual questions, not hardcoded Pass 2

#### 4.1 Replace 2-Pass System
```javascript
// Old: transcriptions.js has pass1 and pass2 hardcoded
// New: Agent decides what to ask based on what's missing

async generateFollowUpQuestions() {
  const useCaseConfig = useCases[this.useCase];
  const missingRequired = useCaseConfig.fields
    .filter(f => f.required && !this.extractedFields[f.key]);

  if (missingRequired.length === 0) {
    return null; // No follow-up needed
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    system: `Generate natural follow-up questions to extract missing required fields.

Context: ${this.useCase} support ticket
Already extracted: ${Object.keys(this.extractedFields).join(', ')}
Still need: ${missingRequired.map(f => f.key).join(', ')}

Generate 1-3 conversational questions that would naturally elicit this information.`,
    messages: [{
      role: "user",
      content: `Based on the partial transcript so far, what follow-up questions should I ask?`
    }]
  });

  return response.content[0].text;
}
```

#### 4.2 Interactive Follow-up Flow
```javascript
// In Recording.jsx
const [followUpQuestions, setFollowUpQuestions] = useState([]);
const [followUpAnswers, setFollowUpAnswers] = useState([]);

// After Pass 1
const questions = await agent.generateFollowUpQuestions();
setFollowUpQuestions(questions);

// User can type or speak answers
// Agent extracts from follow-up responses
```

#### 4.3 Success Criteria
- [ ] No hardcoded follow-up questions
- [ ] Questions adapt to use case and what's missing
- [ ] Questions feel natural, not robotic
- [ ] Can skip follow-ups if all required fields extracted

---

### Phase 5: Intelligent Routing (Week 7)
**Goal:** Agent recommends support agent based on ticket attributes

#### 5.1 Agent Recommendation Tool
```javascript
// New service: src/services/agentRouter.js

export async function recommendSupportAgent(ticket) {
  const agents = [
    {
      id: 'sophie-m',
      name: 'Sophie Martin',
      specialties: ['general', 'first_contact'],
      languages: ['fr', 'en'],
      current_load: 12, // tickets assigned
      avg_response_time: 15 // minutes
    },
    {
      id: 'thomas-r',
      name: 'Thomas Rousseau',
      specialties: ['hardware', 'technical', 'escalation'],
      languages: ['fr'],
      current_load: 8,
      avg_response_time: 25
    },
    {
      id: 'julie-l',
      name: 'Julie Leblanc',
      specialties: ['ecommerce', 'returns', 'vip_customer'],
      languages: ['fr', 'en'],
      current_load: 15,
      avg_response_time: 20
    }
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: `You are a support ticket routing specialist.

Recommend the best agent for this ticket based on:
- Ticket category and complexity
- Agent specialties
- Current workload
- Response time expectations
- Language requirements`,
    tools: [{
      name: "recommend_agent",
      description: "Recommend a support agent for this ticket",
      input_schema: {
        type: "object",
        properties: {
          agent_id: { type: "string" },
          confidence: { type: "number" },
          reasoning: { type: "string" },
          estimated_resolution_time: { type: "number", description: "Minutes" },
          alternative_agents: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["agent_id", "confidence", "reasoning"]
      }
    }],
    messages: [{
      role: "user",
      content: `Recommend an agent for this ticket:\n\n${JSON.stringify(ticket, null, 2)}\n\nAvailable agents:\n${JSON.stringify(agents, null, 2)}`
    }]
  });

  // Extract tool call
  const recommendation = response.content.find(c => c.type === 'tool_use');
  return recommendation.input;
}
```

#### 5.2 Update Confirmation.jsx
```javascript
// Replace random agent selection
const recommendation = await recommendSupportAgent(ticket);

<div className="agent-recommendation">
  <h3>Recommended Agent</h3>
  <AgentCard agent={recommendation} />
  <div className="reasoning">
    <strong>Why:</strong> {recommendation.reasoning}
  </div>
  {recommendation.alternative_agents.length > 0 && (
    <details>
      <summary>Other available agents</summary>
      {recommendation.alternative_agents.map(id => (
        <AgentCard key={id} agent={agents.find(a => a.id === id)} />
      ))}
    </details>
  )}
</div>
```

#### 5.3 Success Criteria
- [ ] Agent routing better than random (measured by resolution time)
- [ ] Recommendations include clear reasoning
- [ ] User can override recommendation
- [ ] Load balancing prevents agent overload

---

### Phase 6: Emergent Capabilities (Week 8+)
**Goal:** Enable use cases you didn't explicitly build

#### 6.1 Expose Atomic Tools Broadly
```javascript
// Create universal ticket manipulation tools
const ticketTools = [
  {
    name: "create_ticket",
    description: "Create a new support ticket",
    input_schema: {
      type: "object",
      properties: {
        use_case: { type: "string", enum: ["it_support", "ecommerce", "saas", "dev_portal"] },
        fields: { type: "object" },
        source: { type: "string", enum: ["voice", "email", "chat", "manual"] }
      }
    }
  },
  {
    name: "search_tickets",
    description: "Search existing tickets",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        filters: { type: "object" },
        limit: { type: "number" }
      }
    }
  },
  {
    name: "update_ticket",
    description: "Update an existing ticket",
    input_schema: {
      type: "object",
      properties: {
        ticket_id: { type: "string" },
        changes: { type: "object" }
      }
    }
  },
  {
    name: "merge_tickets",
    description: "Merge duplicate tickets",
    input_schema: {
      type: "object",
      properties: {
        primary_ticket_id: { type: "string" },
        duplicate_ticket_ids: { type: "array", items: { type: "string" } },
        merge_strategy: { type: "string", enum: ["keep_all_notes", "keep_latest"] }
      }
    }
  },
  {
    name: "analyze_patterns",
    description: "Analyze patterns across multiple tickets",
    input_schema: {
      type: "object",
      properties: {
        ticket_ids: { type: "array", items: { type: "string" } },
        analysis_type: { type: "string", enum: ["root_cause", "trends", "urgency_correlation"] }
      }
    }
  }
];
```

#### 6.2 Enable New Workflows
Users can now ask for things you didn't build:

**Example 1: Email-to-Ticket**
```
User: "Create a ticket from this email: [paste email]"
Agent: [Uses create_ticket with source='email', extracts fields from email body]
```

**Example 2: Duplicate Detection**
```
User: "Find similar tickets to #1234"
Agent: [Uses search_tickets with semantic similarity, suggests merge_tickets if duplicates found]
```

**Example 3: Trend Analysis**
```
User: "Why are we getting so many keyboard tickets this week?"
Agent: [Uses search_tickets for keyboard tickets, analyze_patterns for root cause, generates report]
```

#### 6.3 Success Criteria
- [ ] Agent handles ≥3 use cases you never explicitly coded
- [ ] Tools compose successfully (search → analyze → recommend)
- [ ] User feedback: "It just works" for unexpected requests

---

## Architecture Decisions

### ✅ Use Files For

**1. Conversation Transcripts**
```
/transcripts/
├── {session_id}/
│   ├── audio.webm           # Raw audio (optional)
│   ├── transcript.txt       # STT output
│   ├── pass1.txt           # First extraction attempt
│   └── pass2.txt           # Follow-up responses
```
Why: User might want to review what they said, audio files don't belong in database.

**2. Agent Reasoning Logs**
```
/tickets/{ticket_id}/
├── extraction_log.md        # Field-by-field extraction reasoning
├── agent_recommendations.md # Category, priority, routing suggestions
└── validation_history.md    # User edits during validation phase
```
Why: Transparency, debugging, audit trail. Markdown = human-readable.

**3. Agent Session Checkpoints**
```
/agent_sessions/
└── {session_id}.json
    {
      "agent_type": "VoiceSupportAgent",
      "messages": [...],
      "extracted_fields": {...},
      "timestamp": "2026-01-11T10:30:00Z",
      "resume_point": "awaiting_validation"
    }
```
Why: App backgrounding on mobile, browser crashes, user interruptions.

**4. Agent Prompts and Configurations**
```
/prompts/
├── it_support.md            # IT support extraction prompt
├── ecommerce.md            # E-commerce extraction prompt
├── saas.md                 # SaaS extraction prompt
└── dev_portal.md           # Dev portal extraction prompt
```
Why: Version control, A/B testing, non-engineer editing.

### ✅ Use Supabase For

**1. Final Ticket Data**
```sql
-- tickets table (existing)
-- Indexed, queryable, real-time subscriptions
```
Why: Need to search, filter, sort, join with users/agents tables.

**2. Agent Performance Metrics**
```sql
CREATE TABLE agent_metrics (
  id uuid PRIMARY KEY,
  ticket_id uuid REFERENCES tickets(id),
  extraction_accuracy float,
  confidence_avg float,
  processing_time_ms int,
  user_edits_count int,
  created_at timestamptz
);
```
Why: Analytics, model performance tracking, A/B testing results.

**3. User Feedback on Extractions**
```sql
CREATE TABLE extraction_feedback (
  id uuid PRIMARY KEY,
  ticket_id uuid REFERENCES tickets(id),
  field_name text,
  was_correct boolean,
  user_correction text,
  created_at timestamptz
);
```
Why: Fine-tuning dataset, identify systematic extraction errors.

### ❌ Don't Use Files For

- Final ticket data (use Supabase)
- Real-time ticket updates (use Supabase real-time)
- User authentication state (use Supabase auth)
- High-frequency writes (use Supabase)

---

## Tool Design Reference

### Atomic Tools (Phase 1-3)

| Tool | Purpose | Granularity Test |
|------|---------|------------------|
| `extract_field(name, value, confidence, source)` | Extract one field | ✅ One field, one call |
| `request_clarification(field, question)` | Ask follow-up | ✅ One question, one field |
| `complete_extraction(status, summary)` | Signal done | ✅ One action (completion) |
| `update_field(name, new_value, reason)` | Modify extraction | ✅ One field update |
| `flag_uncertain(field, reason)` | Mark for review | ✅ One field flag |
| `recategorize(category, reasoning)` | Change category | ✅ One attribute change |
| `add_tag(tag_name)` | Add metadata | ✅ One tag addition |
| `recommend_agent(agent_id, reasoning)` | Route ticket | ✅ One recommendation |

### Composition Example

**Task:** "Create ticket from email and assign urgently"

**Agent Plan:**
1. `extract_field` × N (from email body)
2. `create_ticket` (with extracted fields)
3. `set_priority` (to "critical" based on email tone)
4. `recommend_agent` (based on priority + category)

No `create_urgent_ticket_from_email` tool needed.

---

## Completion Signals

### Explicit Completion Tools

```javascript
// In agent tools
{
  name: "complete_extraction",
  description: "Extraction is complete, proceed to validation",
  input_schema: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["complete", "needs_clarification", "needs_human"]
      },
      summary: { type: "string" },
      confidence_overall: { type: "number" }
    }
  }
}
```

### No Heuristics

❌ **Bad:** "If agent sends 3 messages without tool calls, assume done"
✅ **Good:** Agent explicitly calls `complete_extraction` tool

❌ **Bad:** "If 80% of required fields extracted, assume complete"
✅ **Good:** Agent decides based on field importance and confidence

### Partial Completion (Phase 6)

```javascript
// For multi-ticket operations
{
  name: "report_progress",
  description: "Report progress on multi-step task",
  input_schema: {
    type: "object",
    properties: {
      total_tasks: { type: "number" },
      completed_tasks: { type: "number" },
      current_task: { type: "string" },
      can_resume: { type: "boolean" }
    }
  }
}
```

---

## Context Injection Patterns

### System Prompt Template

```javascript
function buildSystemPrompt(useCase, language, userContext) {
  const useCaseConfig = useCases[useCase];

  return `You are a support ticket extraction specialist for ${useCaseConfig.title}.

## Your Role
Extract structured information from voice transcripts and help users create accurate support tickets.

## Current Context
- Use Case: ${useCase}
- Language: ${language}
- User has ${userContext.previousTickets || 0} previous tickets
- Current session started: ${new Date().toISOString()}

## Available Fields
${useCaseConfig.fields.map(f =>
  `- ${f.key}: ${f.label} ${f.required ? '(REQUIRED)' : '(optional)'}\n  ${f.description || ''}`
).join('\n')}

## Field Extraction Guidelines
1. **Precision**: Only extract information explicitly stated in the transcript
2. **Confidence**: If unsure about a field value (<70% confidence), flag it for human review
3. **Completeness**: Prioritize required fields, but capture optional fields when available
4. **Language**: Preserve user's original wording, don't translate or paraphrase
5. **Source**: Always include the exact quote that supports your extraction

## Categorization Rules
${useCaseConfig.categories.map(c => `- ${c.value}: ${c.description}`).join('\n')}

## Priority Assessment
- CRITICAL: System down, data loss, security breach
- HIGH: Major functionality broken, business impact
- MEDIUM: Minor functionality issues, workarounds available
- LOW: Cosmetic issues, feature requests

## Your Workflow
1. Read the transcript carefully
2. Extract fields using the extract_field tool (one call per field)
3. Identify missing required fields
4. If missing required fields, use request_clarification tool
5. When extraction is complete, use complete_extraction tool

## What You Cannot Do
- Don't invent information not in the transcript
- Don't guess at technical details
- Don't skip required fields without requesting clarification
- Don't assume user intent beyond what they stated

## Success Metrics
Your performance is measured by:
- Extraction accuracy (target: >95%)
- Required field completion rate (target: 100%)
- User validation time (target: <30 seconds)
- User edit rate (target: <10% of fields)`;
}
```

### Dynamic Context Updates

```javascript
// After each tool call, inject results into context
messages.push({
  role: "user",
  content: `Tool result: Field "${field_name}" extracted successfully. Confidence: ${confidence}. Continue extraction or complete if done.`
});
```

---

## Success Metrics

### Phase 1-2: Accuracy
- [ ] Field extraction accuracy ≥95% vs hardcoded mappings
- [ ] Required field completion rate 100%
- [ ] Average confidence score ≥0.85

### Phase 3-4: User Experience
- [ ] User validation time ≤30 seconds (down from baseline)
- [ ] User edit rate ≤10% of extracted fields
- [ ] Follow-up questions ≤3 per ticket

### Phase 5-6: Efficiency
- [ ] Ticket creation time ≤2 minutes end-to-end
- [ ] Agent routing accuracy ≥80% (vs manual assignment)
- [ ] First-response time -20% (better routing = faster resolution)

### Phase 7+: Emergent Value
- [ ] ≥3 "unplanned" use cases successfully handled
- [ ] User feature requests satisfied without code changes ≥50%
- [ ] Agent composition depth ≥3 tools per complex request

---

## Anti-Patterns to Avoid

### ❌ Bundling Logic in Tools

```javascript
// Wrong
{
  name: "extract_categorize_and_route",
  description: "Do everything in one step"
}

// Right
// Three separate tools: extract_field, recategorize, recommend_agent
// Agent composes them in a loop
```

### ❌ Orphan UI Actions

```javascript
// Wrong: User can do something in UI that agent can't
<button onClick={markAsUrgent}>Mark Urgent</button>
// No corresponding agent tool

// Right: Add tool
{ name: "set_priority", ... }
```

### ❌ Heuristic Completion

```javascript
// Wrong
if (agent.messageCount > 5 && !agent.hasToolCalls) {
  // Assume agent is done
  completeSession();
}

// Right
if (agent.lastToolCall.name === "complete_extraction") {
  completeSession();
}
```

### ❌ Context Starvation

```javascript
// Wrong: Agent doesn't know what fields are available
const prompt = "Extract support ticket information";

// Right: Inject field schema
const prompt = `Extract these fields: ${fields.map(f => f.key).join(', ')}`;
```

### ❌ Gates Without Reason

```javascript
// Wrong: Arbitrary restriction
if (userRole !== 'admin') {
  disableAgentTools(['delete_ticket', 'merge_tickets']);
}

// Right: Provide tools, add guardrails
{
  name: "delete_ticket",
  description: "Delete ticket (will request confirmation)"
}
```

---

## Mobile Considerations

### Checkpoint Strategy

**When to checkpoint:**
```javascript
// 1. Before app backgrounds
window.addEventListener('pagehide', () => {
  agent.saveCheckpoint();
});

// 2. After each tool call
async function executeToolCall(tool) {
  const result = await tool.execute();
  await agent.saveCheckpoint(); // Incremental save
  return result;
}

// 3. Every 30 seconds during long operations
const checkpointInterval = setInterval(() => {
  if (agent.isProcessing) {
    agent.saveCheckpoint();
  }
}, 30000);
```

**Resume flow:**
```javascript
// On app launch
async function initApp() {
  const sessions = await AgentSession.loadInterrupted();

  if (sessions.length > 0) {
    const validSessions = sessions.filter(s =>
      Date.now() - s.timestamp < 3600000 // 1 hour max age
    );

    if (validSessions.length > 0) {
      showResumePrompt(validSessions);
    }
  }
}
```

### Storage Patterns (iOS/iCloud)

```javascript
// Use iCloud for user-visible data
const ticketTranscripts = await iCloudDocuments.save(
  `transcripts/${ticketId}.txt`,
  transcript
);

// Use local storage for ephemeral agent state
const checkpoint = localStorage.setItem(
  `agent_checkpoint_${sessionId}`,
  JSON.stringify(agentState)
);

// Supabase for final structured data
const ticket = await supabase.from('tickets').insert(ticketData);
```

---

## Migration Path

### Week 1-2: Foundation
- Add Claude SDK
- Create VoiceSupportAgent service
- Replace hardcoded extraction in Recording.jsx
- Maintain exact same UX

### Week 3: Transparency
- Add ExtractionLog component
- Show confidence scores
- Display source quotes

### Week 4: Parity
- Audit all user actions in Validate.jsx
- Add corresponding agent tools
- Test agent can replicate UI workflows

### Week 5-6: Dynamic Follow-ups
- Replace Pass 2 hardcoded questions
- Generate contextual clarifications
- Adaptive questioning based on use case

### Week 7: Intelligent Routing
- Build agent recommendation system
- Replace random agent assignment
- Show routing reasoning

### Week 8+: Emergent Capabilities
- Expose atomic tools broadly
- Support email-to-ticket
- Enable duplicate detection
- Pattern analysis across tickets

---

## Testing Strategy

### Extraction Accuracy Tests

```javascript
describe('VoiceSupportAgent', () => {
  it('extracts IT support fields accurately', async () => {
    const agent = new VoiceSupportAgent('it_support', 'fr');
    const transcript = "Mon PC gaming avec RTX freeze quand je joue...";

    const result = await agent.extractFromTranscript(transcript);

    expect(result.fields.device).toContain('PC gaming');
    expect(result.fields.symptoms).toContain('freeze');
    expect(result.fields.environment).toContain('jeu');
  });

  it('requests clarification for missing required fields', async () => {
    const agent = new VoiceSupportAgent('it_support', 'en');
    const transcript = "My computer crashes"; // Missing device, frequency, etc.

    const result = await agent.extractFromTranscript(transcript);

    expect(result.status).toBe('needs_clarification');
    expect(result.log.some(l => l.action === 'clarify')).toBe(true);
  });
});
```

### Tool Composition Tests

```javascript
describe('Tool Composition', () => {
  it('creates ticket from email and routes appropriately', async () => {
    const email = `Subject: Urgent - Website down
    Body: Our e-commerce site has been down for 2 hours...`;

    // Agent should:
    // 1. extract_field × N
    // 2. create_ticket
    // 3. set_priority (critical)
    // 4. recommend_agent (technical specialist)

    const result = await agent.processEmail(email);

    expect(result.ticket.priority).toBe('critical');
    expect(result.recommendedAgent.specialties).toContain('technical');
  });
});
```

### Parity Tests

```javascript
describe('UI-Agent Parity', () => {
  const uiActions = [
    'update_field',
    'recategorize',
    'set_priority',
    'add_tag',
    'remove_tag',
    'add_note'
  ];

  uiActions.forEach(action => {
    it(`agent has ${action} tool`, () => {
      const tools = agent.getTools();
      expect(tools.some(t => t.name === action)).toBe(true);
    });
  });
});
```

---

## Next Steps

### Immediate (This Week)
1. [ ] Add Claude SDK dependency
2. [ ] Set up environment variable `VITE_ANTHROPIC_API_KEY`
3. [ ] Create `src/services/agent.js` with VoiceSupportAgent class
4. [ ] Implement basic extraction tools (extract_field, complete_extraction)

### Short-term (Next 2 Weeks)
5. [ ] Replace hardcoded extraction in Recording.jsx
6. [ ] Add extraction accuracy tests
7. [ ] Add ExtractionLog UI component
8. [ ] Implement confidence-based validation hints

### Medium-term (Next Month)
9. [ ] Replace Pass 2 hardcoded questions with dynamic generation
10. [ ] Build agent routing recommendation system
11. [ ] Add checkpoint/resume for mobile
12. [ ] Implement file-based logging for transparency

### Long-term (Next Quarter)
13. [ ] Enable email-to-ticket workflow
14. [ ] Add duplicate detection and merging
15. [ ] Pattern analysis across tickets
16. [ ] A/B test agent prompts for accuracy improvements

---

## Conclusion

This implementation plan adapts agent-native architecture to your voice support app's reality:

- **Agents for extraction** - Replace hardcoded mappings with Claude tools
- **Humans for validation** - Keep HITL flow, add transparency
- **Database for tickets** - Supabase stays, files for logs/transcripts
- **Prompts for use cases** - Same agent code, different prompts per use case

The phased approach ensures you can ship value incrementally while building toward emergent capabilities that you didn't explicitly design for.

**Remember:** Parity, Granularity, Composability, Emergence.

**Ultimate test:** Can a user ask for a workflow you never built, and the agent figures it out?
