const productTileContent = {
  id: 0,
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
      pm: 13.64,
      apr: 5.5
    }
  },
  reviews: {
    score: 4.25,
    count: 345
  },
  layout: {
    collapsed: false,
    lean: false
  },
  bike: true,
  label: true,
  favourite: false,
  best_seller: false,
  summer_sale: true,
  new_in: false,
  image: {
    src: '/green-bike.jpeg',
    alt: 'a picture of something green'
  }
};

export const productData = Array(8)
  .fill(productTileContent)
  .map((product) => {
    return {
      ...product,
      id: Math.round(Math.random() * 400)
    };
  });

const brandContent = {
  id: 0,
  title: 'Orbea Rise H30',
  image: {
    src: '/orbea.jpeg',
    alt: 'Orbea Bike'
  },
  brand: {
    src: '/orbeaTitle.jpeg',
    alt: 'Orbea'
  },
  link: {
    url: '/brand/orbea',
    target: '_blank'
  }
};

export const brandData = Array(8)
  .fill(brandContent)
  .map((brand) => {
    return {
      ...brand,
      id: Math.round(Math.random() * 400)
    };
  });
