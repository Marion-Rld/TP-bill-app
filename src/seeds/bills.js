export const bills = [
  //liste des factures
  {
    id: 1,
    billnum: 209345600,
    description: 'Création de site internet et hébergement',
    date: '2023-03-14',
    client: {
      idclient: 1,
      firstName: 'Marc',
      lastName: 'Scout',
      companyName: 'Lumon Industries'
    },
    prestations: [
      {
        id: 46571188,
        description: 'Etude graphique UX',
        qty: 2,
        price: 450.0
      },
      {
        id: 36348759,
        description: 'Création d’un site Wordpress',
        qty: 5,
        price: 450.0
      },
      {
        id: 17629300,
        description: 'Hébergement annuel',
        qty: 1,
        price: 250.0
      }
    ],
    discount: 0.0,
    paid: 0.0,
    totalHT: 3400,
    tva: 20,
    totalTTC: 4080
  },
  {
    id: 2,
    billnum: 209345601,
    description: 'Prestation de formation',
    date: '2023-03-15',
    client: {
      idclient: 2,
      firstName: 'Harry',
      lastName: 'Potter',
      companyName: 'Poudlard & Co.'
    },
    prestations: [
      {
        id: 127278,
        description: 'Apprentissage du maniement de la bagette',
        qty: 1,
        price: 450.0
      },
      {
        id: 12789,
        description: 'Permis de balais',
        qty: 2,
        price: 450.0
      },
      {
        id: 127380,
        description: 'Leçon de sort d’abondance',
        qty: 2,
        price: 450.0
      }
    ],
    discount: 0.0,
    paid: 0.0,
    totalHT: 2250,
    tva: 20,
    totalTTC: 2700
  },
  {
    id: 3,
    billnum: 20945321,
    description: 'Création de site internet et hébergement',
    date: '2024-03-31',
    client: {
      idclient: 3,
      firstName: 'Luc',
      lastName: 'Skywalker',
      companyName: 'Ordre des Jedi'
    },
    prestations: [
      {
        id: 12839,
        description: 'Etude graphique UX',
        qty: 2,
        price: 450.0
      },
      {
        id: 1178,
        description: 'Création d’un site Wordpress',
        qty: 5,
        price: 450.0
      },
      {
        id: 12489,
        description: 'Hébergement annuel',
        qty: 1,
        price: 250.0
      }
    ],
    discount: 0.0,
    paid: 0.0,
    totalHT: 3400,
    tva: 20,
    totalTTC: 4080
  }
]
