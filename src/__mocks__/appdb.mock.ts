import { Types } from 'mongoose';

export const mockApp1 = {
  id: new Types.ObjectId('634dcc03c63d72fe8aa81c98'),
  name: 'dw1-svc',
};

export const appArray = [
  mockApp1,
  {
    id: new Types.ObjectId('634dcc03c63d72fe8aa81c99'),
    name: 'dw2-svc',
  },
];
