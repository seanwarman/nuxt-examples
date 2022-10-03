const bikeData = {
  id: 0,
  name: 'Bike',
  img: {
    width: 500,
    height: 500,
    src: './image/source.jpeg',
    alt: 'Test data image'
  },
  price: 500
};

export const bikes = Array(4)
  .fill(bikeData)
  .map((bike, index) => {
    return {
      ...bike,
      id: index
    };
  });
