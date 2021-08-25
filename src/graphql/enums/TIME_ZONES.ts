import { registerEnumType } from 'type-graphql'

export enum TIME_ZONE {
  UTC_NEG_8_PACIFIC_TIME = 'UTC -08.00 - Pacific Time - US & Canada',
  UTC_NEG_7_MOUNTAIN_TIME = 'UTC -07.00 - Mountain Time - US & Canada',
  UTC_NEG_6_CENTRAL_TIME = 'UTC -06.00 - Central Time - US & Canada',
  UTC_NEG_5_EASTERN_TIME = 'UTC -05.00 - Eastern Time - US & Canada',
  UTC_0_LONDON_TIME = 'UTC 00:00 - Dublin, Edinburgh, Lisbon, London',
  UTC_PLUS_1_WESTERN_EUROPE_TIME = 'UTC +01.00 - Western Europe',
  UTC_PLUS_3_MOSCOW_TIME = 'UTC +03.00 - Moscow, St. Petersburg',
  UTC_PLUS_5_30_MUMBAI_TIME = 'UTC +05.30 - Chennai, Kolkata, Mumbai, New Delhi',
  UTC_PLUS_8_BEIJING_TIME = 'UTC +08:00 - Beijing, Hong Kong, Singapore, Perth',
  UTC_PLUS_9_TOKYO_TIME = 'UTC +09.00 - Seoul, Tokyo',
  UTC_PLUS_9_30_DARWIN_TIME = 'UTC +09.30 - Adelaide, Darwin',
  UTC_PLUS_10_SYDNEY_TIME = 'UTC +10.00 - Brisbane, Canberra, Melbourne, Sydney',
}

registerEnumType(TIME_ZONE, {
  name: 'TIME ZONE',
})
