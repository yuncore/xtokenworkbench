let THOUSAND = 1000;
let MILLION = 1000000;
let BILLION = 1000000000;

let currencyFilter = [
    {
        i18n: 'marketCap',
        name: 'Market Cap',
        col: 'market_cap_usd',
        choices: ['$0 - $ 1Million', '$1Million- $10Million', '$10Million - $100 Million', '$100Million - $1Billion', '$1Billion+'],
        active_index: null,
        multiple: false,
        custom: true,
        unit: [{text: 'Thousand', value: THOUSAND} , {text: 'Million', value: MILLION}, {text: 'Billion', value: BILLION}],
        prepend: '$',
    },
    {
        i18n: 'price',
        name: 'Price',
        col: 'price_usd',
        choices: ['<$0.01', '$0.01 - $1.00', '$1.00 - $100', '$100+'],
        active_index: null,
        multiple: false,
        custom: true,
        prepend: '$'
    }
];

let eventType = {
    'ICO': 'ICO',
    'Comments': '大事件'
};

let SITETYPE = {
    'btt': 1,
    'reddit': 2,
    'github': 3
};

let GRADE_ORDER = ["Donator", "Staff", 'Legendary', 'Hero Member',"Diamond Member", 'Sr. Member', 'Full Member', 'Jr. Member', 'Member' , 'Copper Member', 'Newbie']

export default {
    currencyFilter,
    eventType,
    THOUSAND,
    MILLION,
    BILLION,
    SITETYPE,
    GRADE_ORDER
}
