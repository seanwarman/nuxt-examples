const productTileContent = {
  id: 3124214124,
  sku: 'KS944RUR',
  title: 'Boardman MHT 8.6 endro Mountain Bike',
  uri: '/boardman-mht-86-endro-mountain-bike',
  stock: 152,
  price: {
    // eslint-disable-next-line prettier/prettier
    rrp: 349.99,
    discount: {
      // eslint-disable-next-line prettier/prettier
      new_price: 280.0,
      percentage: 20
    },
    finance: {
      available: true,
      pm: 13.64,
      apr: 5.5
    }
  },
  reviews: {
    score: 4.25,
    count: 345
  },
  image: {
    src: '/boardman-MHT-endro-mountain-bike.png',
    alt: 'a picture of something green'
  },
  favourite: false,
  bike: true
};

const lifeStyleContent1 = {
  id: 3124214124,
  sku: 'KS944RUR',
  title: 'Boardman MHT 8.6 endro Mountain Bike',
  uri: '/boardman-mht-86-endro-mountain-bike',
  stock: 152,
  price: {
    // eslint-disable-next-line prettier/prettier
    rrp: 349.99,
    discount: {
      // eslint-disable-next-line prettier/prettier
      new_price: 280.0,
      percentage: 20
    },
    finance: {
      available: true,
      pm: 13.64,
      apr: 5.5
    }
  },
  reviews: {
    score: 4.25,
    count: 345
  },
  image: {
    src: '/bundle-lifestyle-longsleeve.png',
    alt: 'a picture of a longsleeve shirt'
  },
  favourite: false
};

const lifeStyleContent2 = {
  id: 3124214124,
  sku: 'KS944RUR',
  title: 'Boardman MHT 8.6 endro Mountain Bike',
  uri: '/boardman-mht-86-endro-mountain-bike',
  stock: 152,
  price: {
    // eslint-disable-next-line prettier/prettier
    rrp: 349.99,
    discount: {
      // eslint-disable-next-line prettier/prettier
      new_price: 280.0,
      percentage: 20
    },
    finance: {
      available: true,
      pm: 13.64,
      apr: 5.5
    }
  },
  reviews: {
    score: 4.25,
    count: 345
  },
  image: {
    src: '/bundle-lifestyle-helmet.png',
    alt: 'a picture of a helmet'
  },
  favourite: false
};

const images = [
  {
    src: '/lifestyle-small.png',
    alt: 'Lifestyle',
    keyword: ['mobile']
  },
  {
    src: '/lifestyle-landscape.png',
    alt: 'Lifestyle',
    keyword: ['tablet', 'landscape']
  },
  {
    src: '/lifestyle.png',
    alt: 'Lifestyle',
    keyword: ['desktop']
  },
  {
    src: '/lifestyle.png',
    alt: 'Lifestyle',
    keyword: ['default']
  }
];

const bundle = {
  image: {
    width: 1741,
    height: 2619,
    alt: 'Biker travelling through brecon',
    src: 'https://media.graphassets.com/resize=fit:clip,height:2000,width:2000/output=format:webp/iTiuJ5mGRyUDxmH114eP'
  },
  media: [
    {
      formats: {
        webp: 'https://media.graphassets.com/resize=fit:clip,height:2000,width:2000/output=format:webp/iTiuJ5mGRyUDxmH114eP',
        png: 'https://media.graphassets.com/resize=fit:clip,height:2000,width:2000/output=format:png/iTiuJ5mGRyUDxmH114eP'
      },
      keywords: ['desktop', '2000']
    },
    {
      width: '1000',
      formats: {
        webp: 'https://media.graphassets.com/resize=fit:clip,height:1500,width:1000/output=format:webp/iTiuJ5mGRyUDxmH114eP',
        png: 'https://media.graphassets.com/resize=fit:clip,height:1500,width:1000/output=format:png/iTiuJ5mGRyUDxmH114eP'
      },
      keywords: ['small-desktop', '1000']
    },
    {
      width: '800',
      formats: {
        webp: 'https://media.graphassets.com/resize=fit:crop,height:800,width:800/output=format:webp/iTiuJ5mGRyUDxmH114eP',
        png: 'https://media.graphassets.com/resize=fit:crop,height:800,width:800/output=format:png/iTiuJ5mGRyUDxmH114eP'
      },
      keywords: ['tablet', '800']
    },
    {
      width: '600',
      formats: {
        webp: 'https://media.graphassets.com/resize=fit:crop,height:320,width:400/output=format:webp/iTiuJ5mGRyUDxmH114eP',
        png: 'https://media.graphassets.com/resize=fit:crop,height:320,width:400/output=format:png/iTiuJ5mGRyUDxmH114eP'
      },
      keywords: ['mobile', '600']
    }
  ],
  price: '2,990',
  total: 3,
  call_to_action: {
    label: 'Buy the look'
  }
};

export const data = {
  bundle: bundle,
  products: [productTileContent, lifeStyleContent1, lifeStyleContent2]
};
