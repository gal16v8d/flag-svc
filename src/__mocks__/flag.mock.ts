import { Types } from 'mongoose';

export const mockFlag1 = {
  id: new Types.ObjectId('634dcc03c63d72fe8aa81c90'),
  appId: new Types.ObjectId('634dcc03c63d72fe8aa81c98'),
  name: 'TEST_FLAG',
  value: false,
};

export const flagArray = [
  mockFlag1,
  {
    id: new Types.ObjectId('634dcc03c63d72fe8aa81c91'),
    appId: new Types.ObjectId('634dcc03c63d72fe8aa81c99'),
    name: 'TEST_FLAG_2',
    value: true,
  },
];
