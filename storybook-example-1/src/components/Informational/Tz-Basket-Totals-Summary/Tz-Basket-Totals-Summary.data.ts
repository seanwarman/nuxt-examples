import { DiscountType } from '@/components/Informational/types';

export const data = {
  noOfItems: 3,
  subTotal: 5100,
  discounts: [
    {
      name: 'C2W discount',
      amount: 1000,
      type: DiscountType.cycleToWork
    },
    {
      name: 'signup10',
      amount: 24.99,
      type: DiscountType.vochure
    },
    {
      name: 'freepump',
      amount: 19.99,
      type: DiscountType.freeGift
    }
  ],
  savings: 1044.98,
  shippingCountries: [
    {
      id: 1,
      name: 'UK mainland'
    },
    {
      id: 2,
      name: 'Northen island'
    },
    {
      id: 3,
      name: 'Scottish highlands'
    },
    {
      id: 4,
      name: 'Scottish islands'
    },
    {
      id: 5,
      name: 'Isle of man'
    }
  ],
  selectedShippingCountry: 1,
  shippingMessage: 'Est, delivery: 15/06/22',
  shippingCost: 0,
  total: 4075.02
};
