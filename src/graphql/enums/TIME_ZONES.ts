import { registerEnumType } from 'type-graphql'

export enum TIME_ZONE {
  UTC_NEG_8_PACIFIC_TIME = 'UTC_NEG_8_00_Pacific_Time_US_Canada',
  UTC_NEG_7_MOUNTAIN_TIME = 'UTC_NEG_7_00_Mountain_Time_US_Canada',
  UTC_NEG_6_CENTRAL_TIME = 'UTC_NEG_6_00_Central_Time_US_Canada',
  UTC_NEG_5_EASTERN_TIME = 'UTC_NEG_5_00_Eastern_Time_US_Canada',
  UTC_0_LONDON_TIME = 'UTC_0_00_Dublin_Edinburgh_Lisbon_London',
  UTC_PLUS_1_WESTERN_EUROPE_TIME = 'UTC_1_00_Western_Europe',
  UTC_PLUS_3_MOSCOW_TIME = 'UTC_3_00_Moscow_St_Petersburg',
  UTC_PLUS_5_30_MUMBAI_TIME = 'UTC_5_30_Chennai_Kolkata_Mumbai_New_Delhi',
  UTC_PLUS_8_BEIJING_TIME = 'UTC_8_00_Beijing_Hong_Kong_Singapore_Perth',
  UTC_PLUS_9_TOKYO_TIME = 'UTC_9_00_Seoul_Tokyo',
  UTC_PLUS_9_30_DARWIN_TIME = 'UTC_9_30_Adelaide_Darwin',
  UTC_PLUS_10_SYDNEY_TIME = 'UTC_10_00_Brisbane_Canberra_Melbourne_Sydney',
}

registerEnumType(TIME_ZONE, {
  name: 'TIME ZONE',
})
