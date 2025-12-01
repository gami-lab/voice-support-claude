import { Categories, Priority, Tags } from './enums';

// Sample transcriptions with 2-pass simulation
export const transcriptions = {
  it_support: [
    {
      id: 'it_support_1',
      pass1: {
        transcript: "Ouais bonjour euh... alors voilà j'appelle parce que j'ai un souci avec mon ordinateur, enfin c'est un PC que j'ai acheté chez vous y'a pas longtemps, je sais plus exactement quand, peut-être deux semaines ou trois. Donc le problème c'est que quand je joue, enfin quand je lance un jeu quoi, l'écran devient noir d'un coup. Noir complet. Et après faut que je redémarre tout. C'est super chiant parce que moi je fais du stream sur Twitch, enfin j'essaie de lancer ma chaîne quoi, et là bah je peux rien faire. Ah et c'est une RTX machin, je sais plus le numéro exact. Voilà c'est ça en gros.",
        mapping: {
          device: 'PC gaming avec RTX',
          symptoms: 'Écran noir au lancement de jeux, nécessite redémarrage',
          impact: 'Activité de streaming impossible',
          category: Categories.it_support.HARDWARE,
          priority: Priority.HIGH,
        },
        missing: ['frequency', 'environment', 'actions_tried'],
      },
      pass2: {
        prompt: {
          fr: "Depuis quand ce problème se produit-il et à quelle fréquence ? Avez-vous déjà essayé quelque chose pour le résoudre ?",
          en: "When did this problem start and how often does it occur? Have you already tried anything to fix it?",
        },
        transcript: "Ah oui pardon. Alors ça fait depuis... bah depuis hier en fait, ça a commencé hier soir. Et ça le fait à chaque fois que je lance un jeu, genre 100% du temps. J'ai essayé de mettre à jour les drivers avec GeForce Experience là, mais ça change rien. J'ai aussi essayé un autre écran, celui de ma copine, même problème. Ah et je suis sur Windows 11.",
        mapping: {
          frequency: 'Systématique depuis hier, 100% des lancements',
          environment: 'Windows 11, drivers mis à jour via GeForce Experience',
          actions_tried: 'Mise à jour drivers, test autre écran',
          priority: Priority.CRITICAL,
          tags: [Tags.URGENT, Tags.RECURRING],
        },
      },
    },
    {
      id: 'it_support_2',
      pass1: {
        transcript: "Bonjour, c'est pour un clavier. Un clavier sans fil que vous m'avez vendu. Il marche plus. Enfin il marchait très bien avant hein, je l'utilise depuis... pfff je sais pas, quelques mois. Et là d'un coup plus rien, les touches répondent pas. J'ai changé les piles, j'ai mis des piles neuves Duracell là, mais ça fait rien. Je comprends pas. C'est un Logitech je crois. Ou Microsoft, je sais plus. Gris en tout cas.",
        mapping: {
          device: 'Clavier sans fil (Logitech ou Microsoft, gris)',
          symptoms: 'Touches ne répondent plus',
          actions_tried: 'Remplacement des piles',
          category: Categories.it_support.PERIPHERAL,
          priority: Priority.MEDIUM,
        },
        missing: ['frequency', 'environment', 'impact'],
      },
      pass2: {
        prompt: {
          fr: "Depuis quand exactement le clavier ne fonctionne plus ? Sur quel ordinateur l'utilisez-vous ?",
          en: "Since when exactly has the keyboard stopped working? What computer are you using it with?",
        },
        transcript: "Euh c'est depuis ce matin en fait. Je l'ai allumé ce matin, ça marchait pas. Hier soir ça marchait encore. C'est sur un PC Windows, un PC fixe. J'en ai besoin pour bosser donc c'est quand même embêtant là.",
        mapping: {
          frequency: 'Depuis ce matin, hier soir OK',
          environment: 'PC fixe Windows',
          impact: 'Blocage pour le travail',
          priority: Priority.HIGH,
          tags: [Tags.URGENT],
        },
      },
    },
  ],
  ecommerce: [
    {
      id: 'ecommerce_1',
      pass1: {
        transcript: "Allô bonjour, oui alors j'ai un problème avec une commande. J'ai commandé des baskets, des Nike Air Max je crois, ou des Air Force, enfin des Nike blanches quoi. Et elles sont pas arrivées. Ça fait... attendez... ça fait bientôt deux semaines je pense. Le truc c'est que sur le site de suivi là, Colissimo, ça dit que c'est livré. Mais j'ai rien reçu moi ! J'ai regardé partout, chez les voisins, dans le local poubelle, rien. Mon numéro de commande c'est euh... attendez je cherche... 78432 voilà.",
        mapping: {
          order_number: '78432',
          problem_type: 'Colis non reçu malgré statut "livré"',
          product_description: 'Baskets Nike blanches (Air Max ou Air Force)',
          delivery_status: 'Marqué livré sur Colissimo',
          actions_tried: 'Vérifié voisins et local poubelle',
          category: Categories.ecommerce.DELIVERY,
          priority: Priority.HIGH,
        },
        missing: ['desired_resolution', 'purchase_date'],
      },
      pass2: {
        prompt: {
          fr: "Qu'attendez-vous de notre part : un remboursement ou une réexpédition ? Vous souvenez-vous de la date de commande ?",
          en: "What would you like from us: a refund or reshipping? Do you remember the order date?",
        },
        transcript: "Ah oui. Bah idéalement je voudrais les recevoir quoi, les chaussures. Mais si c'est pas possible, remboursez-moi. J'ai commandé le... le 15 novembre je crois. Ou le 16. Mi-novembre en tout cas. Ah et j'ai essayé d'appeler Colissimo mais impossible de les avoir, 45 minutes d'attente j'ai abandonné.",
        mapping: {
          desired_resolution: 'Réexpédition prioritaire, sinon remboursement',
          purchase_date: 'Mi-novembre (15-16)',
          actions_tried: 'Vérifié voisins et local poubelle + Tentative appel Colissimo (abandonné)',
          tags: [Tags.ESCALATION],
        },
      },
    },
    {
      id: 'ecommerce_2',
      pass1: {
        transcript: "Bonjour, voilà j'ai reçu ma commande mais c'est pas la bonne taille. J'avais commandé du 44 et j'ai reçu du 42. C'est des mocassins marron. Le problème c'est que je les voulais pour un mariage ce week-end donc voilà quoi. Mon numéro c'est... 78501. Je sais pas comment vous avez fait cette erreur franchement, c'était bien marqué 44 sur ma commande j'ai vérifié.",
        mapping: {
          order_number: '78501',
          problem_type: 'Mauvaise taille reçue (42 au lieu de 44)',
          product_description: 'Mocassins marron',
          impact: 'Nécessaire pour mariage ce week-end',
          category: Categories.ecommerce.WRONG_ITEM,
          priority: Priority.HIGH,
        },
        missing: ['desired_resolution', 'delivery_status'],
      },
      pass2: {
        prompt: {
          fr: "Souhaitez-vous un échange ou un remboursement ? Quand avez-vous reçu le colis ?",
          en: "Would you like an exchange or a refund? When did you receive the package?",
        },
        transcript: "Bah un échange évidemment, je veux mes chaussures en 44 ! Mais il faudrait que je les aie avant samedi, c'est possible ça ? J'ai reçu le colis avant-hier, donc lundi.",
        mapping: {
          desired_resolution: 'Échange taille 44, livraison avant samedi',
          delivery_status: 'Reçu lundi',
          tags: [Tags.URGENT, Tags.VIP_CUSTOMER],
          priority: Priority.CRITICAL,
        },
      },
    },
  ],
  saas: [
    {
      id: 'saas_1',
      pass1: {
        transcript: "Bonjour, j'appelle parce qu'on a un gros problème avec votre CRM là. En fait quand on essaie d'exporter les rapports en PDF, ça plante. Ça mouline, ça mouline, et après y'a une erreur. On peut pas bosser là, toute l'équipe commerciale est bloquée. On a une réunion avec la direction demain matin et on a besoin de ces rapports. Ah et ça le fait que quand y'a plus de 100 lignes je crois. Les petits rapports ça passe.",
        mapping: {
          feature: 'Export rapports PDF',
          symptoms: 'Plantage après chargement, erreur affichée',
          impact: 'Équipe commerciale bloquée, réunion direction demain',
          frequency: 'Quand plus de 100 lignes',
          category: Categories.saas.BUG,
          priority: Priority.CRITICAL,
        },
        missing: ['environment', 'steps_to_reproduce'],
      },
      pass2: {
        prompt: {
          fr: "Quel navigateur et système utilisez-vous ? Pouvez-vous décrire les étapes exactes pour reproduire le problème ?",
          en: "What browser and system are you using? Can you describe the exact steps to reproduce the problem?",
        },
        transcript: "On est sur Chrome, dernière version. Windows 11 pour la plupart, y'en a peut-être un ou deux sur Mac je sais pas. Pour reproduire bah... on va dans Rapports, on clique sur Ventes Q4, et on fait Exporter PDF. Et là ça plante. Enfin pas tout de suite, ça tourne 30 secondes et après erreur. Le message dit un truc comme 'timeout' je crois.",
        mapping: {
          environment: 'Chrome dernière version, Windows 11 (majoritaire)',
          steps_to_reproduce: 'Rapports → Ventes Q4 → Exporter PDF → timeout ~30s',
          tags: [Tags.URGENT, Tags.RECURRING],
        },
      },
    },
    {
      id: 'saas_2',
      pass1: {
        transcript: "Salut, c'est pas vraiment un bug mais une suggestion. Ça serait vraiment bien d'avoir un filtre par date sur le tableau de bord principal. Parce que là pour voir les données d'une période précise, on est obligé de tout exporter dans Excel et de filtrer à la main. C'est pas pratique du tout. Mes commerciaux me demandent ça depuis des mois.",
        mapping: {
          feature: 'Tableau de bord - filtres',
          symptoms: 'Absence de filtre par date',
          impact: 'Export Excel obligatoire, perte de temps',
          category: Categories.saas.FEATURE_REQUEST,
          priority: Priority.LOW,
        },
        missing: ['frequency', 'steps_to_reproduce', 'environment'],
      },
      pass2: {
        prompt: {
          fr: "Depuis combien de temps rencontrez-vous ce besoin ? Utilisez-vous un navigateur particulier ?",
          en: "How long have you had this need? Are you using a particular browser?",
        },
        transcript: "Ça fait plusieurs mois qu'on galère avec ça. Je dirais au moins 6 mois. On utilise Chrome principalement, mais c'est pareil sur tous les navigateurs vu que c'est une fonctionnalité qui manque. C'est pas hyper urgent, mais ce serait vraiment apprécié.",
        mapping: {
          frequency: 'Besoin permanent depuis 6 mois',
          environment: 'Chrome (tous navigateurs concernés)',
          tags: [],
        },
      },
    },
  ],
  dev_portal: [
    {
      id: 'dev_portal_1',
      pass1: {
        transcript: "Salut, je vous contacte pour signaler un bug sur le portail. En fait quand on clique deux fois sur Sauvegarder, enfin si on clique vite deux fois, ça crée des doublons dans la base. Genre la même entrée apparaît deux fois. C'est assez gênant parce qu'après on sait plus c'est laquelle la bonne. Ça nous est arrivé plusieurs fois cette semaine.",
        mapping: {
          request_type: 'Bug',
          description: 'Double-clic Sauvegarder crée des doublons',
          context: 'Plusieurs fois cette semaine',
          category: Categories.dev_portal.BUG,
          priority: Priority.HIGH,
        },
        missing: ['urgency', 'expected_behavior'],
      },
      pass2: {
        prompt: {
          fr: "C'est urgent pour vous ? Et quel comportement attendriez-vous normalement ?",
          en: "Is this urgent for you? And what behavior would you normally expect?",
        },
        transcript: "Oui c'est quand même urgent parce qu'on doit nettoyer les doublons à la main et on perd du temps. Normalement bah... soit le bouton devrait se griser après le premier clic, soit ça devrait ignorer le deuxième clic quoi. C'est du bon sens. On aimerait que ce soit corrigé rapidement.",
        mapping: {
          urgency: 'Urgent (nettoyage manuel coûteux)',
          expected_behavior: 'Bouton grisé ou second clic ignoré',
          tags: [Tags.URGENT],
          priority: Priority.CRITICAL,
        },
      },
    },
    {
      id: 'dev_portal_2',
      pass1: {
        transcript: "Bonjour, j'ai une remarque concernant votre documentation. Quand on veut implémenter l'authentification OAuth, y'a vraiment pas assez d'exemples. J'ai passé deux heures à chercher comment faire et j'ai dû aller sur Stack Overflow pour trouver. C'est dommage parce que le reste de la doc est plutôt bien fait.",
        mapping: {
          request_type: 'Documentation',
          description: "Manque d'exemples pour authentification OAuth",
          impact: '2h de recherche, recours à Stack Overflow',
          category: Categories.dev_portal.DOCUMENTATION,
          priority: Priority.MEDIUM,
        },
        missing: ['urgency', 'context'],
      },
      pass2: {
        prompt: {
          fr: "Quel niveau d'urgence donneriez-vous à cette amélioration ? Dans quel contexte utilisez-vous OAuth ?",
          en: "What level of urgency would you give to this improvement? In what context are you using OAuth?",
        },
        transcript: "C'est pas hyper urgent, on a trouvé un workaround. Mais pour les prochains développeurs qui vont utiliser votre API, ce serait vraiment mieux. On utilise OAuth pour connecter notre app mobile à vos services. Des exemples en Python et JavaScript seraient top.",
        mapping: {
          urgency: 'Pas urgent, workaround trouvé',
          context: 'App mobile, connexion API, Python/JS souhaités',
          ideas_needs: 'Exemples Python et JavaScript',
          tags: [Tags.WORKAROUND_AVAILABLE],
        },
      },
    },
  ],
};

// English versions of transcriptions
export const transcriptionsEN = {
  it_support: [
    {
      id: 'it_support_1',
      pass1: {
        transcript: "Yeah hello uh... so here's the thing, I'm calling because I have an issue with my computer, well it's a PC that I bought from you not long ago, I don't remember exactly when, maybe two or three weeks. So the problem is that when I play, well when I launch a game, the screen goes black suddenly. Completely black. And then I have to restart everything. It's super annoying because I stream on Twitch, well I'm trying to launch my channel, and I can't do anything. Oh and it's an RTX something, I don't remember the exact number. That's basically it.",
        mapping: {
          device: 'Gaming PC with RTX',
          symptoms: 'Black screen when launching games, requires restart',
          impact: 'Streaming activity impossible',
          category: Categories.it_support.HARDWARE,
          priority: Priority.HIGH,
        },
        missing: ['frequency', 'environment', 'actions_tried'],
      },
      pass2: {
        prompt: {
          fr: "Depuis quand ce problème se produit-il et à quelle fréquence ? Avez-vous déjà essayé quelque chose pour le résoudre ?",
          en: "When did this problem start and how often does it occur? Have you already tried anything to fix it?",
        },
        transcript: "Oh yes sorry. So it's been since... well since yesterday actually, it started last night. And it happens every time I launch a game, like 100% of the time. I tried updating the drivers with GeForce Experience, but it doesn't change anything. I also tried another screen, my girlfriend's, same problem. Oh and I'm on Windows 11.",
        mapping: {
          frequency: 'Systematic since yesterday, 100% of launches',
          environment: 'Windows 11, drivers updated via GeForce Experience',
          actions_tried: 'Driver update, tested another screen',
          priority: Priority.CRITICAL,
          tags: [Tags.URGENT, Tags.RECURRING],
        },
      },
    },
    {
      id: 'it_support_2',
      pass1: {
        transcript: "Hello, it's about a keyboard. A wireless keyboard you sold me. It doesn't work anymore. Well it worked very well before, I've been using it for... I don't know, a few months. And suddenly nothing, the keys don't respond. I changed the batteries, I put new Duracell batteries, but it doesn't do anything. I don't understand. It's a Logitech I think. Or Microsoft, I'm not sure. Gray anyway.",
        mapping: {
          device: 'Wireless keyboard (Logitech or Microsoft, gray)',
          symptoms: 'Keys no longer respond',
          actions_tried: 'Battery replacement',
          category: Categories.it_support.PERIPHERAL,
          priority: Priority.MEDIUM,
        },
        missing: ['frequency', 'environment', 'impact'],
      },
      pass2: {
        prompt: {
          fr: "Depuis quand exactement le clavier ne fonctionne plus ? Sur quel ordinateur l'utilisez-vous ?",
          en: "Since when exactly has the keyboard stopped working? What computer are you using it with?",
        },
        transcript: "Uh it's since this morning actually. I turned it on this morning, it didn't work. Last night it was still working. It's on a Windows PC, a desktop PC. I need it for work so it's quite annoying.",
        mapping: {
          frequency: 'Since this morning, last night OK',
          environment: 'Windows desktop PC',
          impact: 'Blocking for work',
          priority: Priority.HIGH,
          tags: [Tags.URGENT],
        },
      },
    },
  ],
  ecommerce: [
    {
      id: 'ecommerce_1',
      pass1: {
        transcript: "Hello yes, so I have a problem with an order. I ordered sneakers, Nike Air Max I think, or Air Force, well white Nike. And they didn't arrive. It's been... wait... it's been almost two weeks I think. The thing is that on the tracking site, Colissimo, it says it's delivered. But I received nothing! I looked everywhere, at the neighbors, in the trash room, nothing. My order number is uh... wait I'm looking... 78432 there.",
        mapping: {
          order_number: '78432',
          problem_type: 'Package not received despite "delivered" status',
          product_description: 'White Nike sneakers (Air Max or Air Force)',
          delivery_status: 'Marked delivered on Colissimo',
          actions_tried: 'Checked neighbors and trash room',
          category: Categories.ecommerce.DELIVERY,
          priority: Priority.HIGH,
        },
        missing: ['desired_resolution', 'purchase_date'],
      },
      pass2: {
        prompt: {
          fr: "Qu'attendez-vous de notre part : un remboursement ou une réexpédition ? Vous souvenez-vous de la date de commande ?",
          en: "What would you like from us: a refund or reshipping? Do you remember the order date?",
        },
        transcript: "Oh yes. Well ideally I would like to receive them, the shoes. But if it's not possible, refund me. I ordered on... on November 15th I think. Or the 16th. Mid-November anyway. Oh and I tried calling Colissimo but impossible to reach them, 45 minutes waiting I gave up.",
        mapping: {
          desired_resolution: 'Priority reshipping, otherwise refund',
          purchase_date: 'Mid-November (15-16)',
          actions_tried: 'Checked neighbors and trash room + Attempted call to Colissimo (abandoned)',
          tags: [Tags.ESCALATION],
        },
      },
    },
    {
      id: 'ecommerce_2',
      pass1: {
        transcript: "Hello, so I received my order but it's not the right size. I ordered size 44 and I received size 42. They're brown loafers. The problem is I wanted them for a wedding this weekend so there you go. My number is... 78501. I don't know how you made this mistake honestly, it was clearly marked 44 on my order I checked.",
        mapping: {
          order_number: '78501',
          problem_type: 'Wrong size received (42 instead of 44)',
          product_description: 'Brown loafers',
          impact: 'Needed for wedding this weekend',
          category: Categories.ecommerce.WRONG_ITEM,
          priority: Priority.HIGH,
        },
        missing: ['desired_resolution', 'delivery_status'],
      },
      pass2: {
        prompt: {
          fr: "Souhaitez-vous un échange ou un remboursement ? Quand avez-vous reçu le colis ?",
          en: "Would you like an exchange or a refund? When did you receive the package?",
        },
        transcript: "Well an exchange obviously, I want my shoes in size 44! But I would need them before Saturday, is that possible? I received the package the day before yesterday, so Monday.",
        mapping: {
          desired_resolution: 'Size 44 exchange, delivery before Saturday',
          delivery_status: 'Received Monday',
          tags: [Tags.URGENT, Tags.VIP_CUSTOMER],
          priority: Priority.CRITICAL,
        },
      },
    },
  ],
  saas: [
    {
      id: 'saas_1',
      pass1: {
        transcript: "Hello, I'm calling because we have a big problem with your CRM. Actually when we try to export reports to PDF, it crashes. It spins, it spins, and then there's an error. We can't work, the whole sales team is blocked. We have a meeting with management tomorrow morning and we need these reports. Oh and it only happens when there are more than 100 lines I think. Small reports work fine.",
        mapping: {
          feature: 'PDF report export',
          symptoms: 'Crash after loading, error displayed',
          impact: 'Sales team blocked, management meeting tomorrow',
          frequency: 'When more than 100 lines',
          category: Categories.saas.BUG,
          priority: Priority.CRITICAL,
        },
        missing: ['environment', 'steps_to_reproduce'],
      },
      pass2: {
        prompt: {
          fr: "Quel navigateur et système utilisez-vous ? Pouvez-vous décrire les étapes exactes pour reproduire le problème ?",
          en: "What browser and system are you using? Can you describe the exact steps to reproduce the problem?",
        },
        transcript: "We're on Chrome, latest version. Windows 11 for most, there might be one or two on Mac I don't know. To reproduce well... we go to Reports, we click on Q4 Sales, and we do Export PDF. And then it crashes. Well not immediately, it spins for 30 seconds and then error. The message says something like 'timeout' I think.",
        mapping: {
          environment: 'Chrome latest version, Windows 11 (majority)',
          steps_to_reproduce: 'Reports → Q4 Sales → Export PDF → timeout ~30s',
          tags: [Tags.URGENT, Tags.RECURRING],
        },
      },
    },
    {
      id: 'saas_2',
      pass1: {
        transcript: "Hi, it's not really a bug but a suggestion. It would be really nice to have a date filter on the main dashboard. Because right now to see data from a specific period, we have to export everything to Excel and filter manually. It's not practical at all. My salespeople have been asking for this for months.",
        mapping: {
          feature: 'Dashboard - filters',
          symptoms: 'Absence of date filter',
          impact: 'Excel export required, time waste',
          category: Categories.saas.FEATURE_REQUEST,
          priority: Priority.LOW,
        },
        missing: ['frequency', 'steps_to_reproduce', 'environment'],
      },
      pass2: {
        prompt: {
          fr: "Depuis combien de temps rencontrez-vous ce besoin ? Utilisez-vous un navigateur particulier ?",
          en: "How long have you had this need? Are you using a particular browser?",
        },
        transcript: "We've been struggling with this for several months. I'd say at least 6 months. We mainly use Chrome, but it's the same on all browsers since it's a missing feature. It's not super urgent, but it would be really appreciated.",
        mapping: {
          frequency: 'Permanent need for 6 months',
          environment: 'Chrome (all browsers affected)',
          tags: [],
        },
      },
    },
  ],
  dev_portal: [
    {
      id: 'dev_portal_1',
      pass1: {
        transcript: "Hi, I'm contacting you to report a bug on the portal. Actually when you double-click on Save, well if you click twice quickly, it creates duplicates in the database. Like the same entry appears twice. It's quite annoying because then we don't know which one is the right one. It happened to us several times this week.",
        mapping: {
          request_type: 'Bug',
          description: 'Double-click Save creates duplicates',
          context: 'Several times this week',
          category: Categories.dev_portal.BUG,
          priority: Priority.HIGH,
        },
        missing: ['urgency', 'expected_behavior'],
      },
      pass2: {
        prompt: {
          fr: "C'est urgent pour vous ? Et quel comportement attendriez-vous normalement ?",
          en: "Is this urgent for you? And what behavior would you normally expect?",
        },
        transcript: "Yes it's quite urgent because we have to clean up the duplicates manually and we waste time. Normally well... either the button should be grayed out after the first click, or it should ignore the second click. It's common sense. We'd like this to be fixed quickly.",
        mapping: {
          urgency: 'Urgent (manual cleanup costly)',
          expected_behavior: 'Button grayed out or second click ignored',
          tags: [Tags.URGENT],
          priority: Priority.CRITICAL,
        },
      },
    },
    {
      id: 'dev_portal_2',
      pass1: {
        transcript: "Hello, I have a comment about your documentation. When you want to implement OAuth authentication, there really aren't enough examples. I spent two hours looking for how to do it and I had to go to Stack Overflow to find it. It's a shame because the rest of the doc is pretty well done.",
        mapping: {
          request_type: 'Documentation',
          description: 'Lack of examples for OAuth authentication',
          impact: '2h search, resort to Stack Overflow',
          category: Categories.dev_portal.DOCUMENTATION,
          priority: Priority.MEDIUM,
        },
        missing: ['urgency', 'context'],
      },
      pass2: {
        prompt: {
          fr: "Quel niveau d'urgence donneriez-vous à cette amélioration ? Dans quel contexte utilisez-vous OAuth ?",
          en: "What level of urgency would you give to this improvement? In what context are you using OAuth?",
        },
        transcript: "It's not super urgent, we found a workaround. But for the next developers who will use your API, it would be much better. We use OAuth to connect our mobile app to your services. Examples in Python and JavaScript would be great.",
        mapping: {
          urgency: 'Not urgent, workaround found',
          context: 'Mobile app, API connection, Python/JS desired',
          ideas_needs: 'Python and JavaScript examples',
          tags: [Tags.WORKAROUND_AVAILABLE],
        },
      },
    },
  ],
};
