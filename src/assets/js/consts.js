let currencyHeads = [
    //{col: 'rank', label: 'Rank', show: false, sortable: true, icon: 'static/img/btt.png', stick: true},
    // {col: 'name', label: 'Name', show: false, sortable: false, icon: 'static/img/btt.png', stick: true, align:'left'},
    // {col: 'symbol', label: 'Symbol', show: true, sortable: false, icon: 'static/img/btt.png', stick: true},
    {i18n: 'th1', col: 'market_cap_usd', label: 'Market Cap', show: true, sortable: true, icon: 'static/img/marketcap.png', width: '150'},
    {i18n: 'th2', col: 'percent_change_1h', label: 'Change (1h)', show: true, sortable: true, icon: 'static/img/1h.png', width: '120'},
    {i18n: 'th3', col: 'percent_change_24h', label: 'Change (24h)', show: true, sortable: true, icon: 'static/img/24h.png', width: '120'},
    {i18n: 'th4', col: 'percent_change_7d', label: 'Change (7d)', show: true, sortable: true, icon: 'static/img/7d.png', width: '120'},
    {i18n: 'th5', col: 'price_btc', label: 'Price (btc)', show: true, sortable: true, icon: 'static/img/bitcoin.png', width: '120', align: 'left'},
    {i18n: 'th6', col: 'price_usd', label: 'Price (usd)', show: true, sortable: true, icon: 'static/img/usd.png', width: '120', align: 'left'},
    {i18n: 'th7', col: 'total_supply', label: 'Total Supply', show: true, sortable: true, icon: 'static/img/total.png', width: '150', align: 'left'},
    {i18n: 'th8', col: 'available_supply', label: 'Available Supply', show: true, sortable: true, icon: 'static/img/ava.png', width: '150', align: 'left'},
    {i18n: 'th9', col: 'max_supply', label: 'Max Supply', show: true, sortable: true, icon: 'static/img/max.png', width: '150', align: 'left'},
    {i18n: 'th10', col: 'last_updated', label: 'Updated Time', show: true, sortable: true, icon: 'static/img/update.png', width: '150'},
    {i18n: 'th11', col: 'btt', label: 'Btt Replies', show: true, sortable: false, icon: 'static/img/btt.png'},
    {i18n: 'th12', col: 'github', label: 'Github', show: true, sortable: false, icon: 'static/img/github.png'},
    {i18n: 'th13', col: 'reddit', label: 'Reddit', show: true, sortable: false, icon: 'static/img/reddit.png'},
    {i18n: 'th14', col: 'ico_raised', label: 'ICO', show: true, sortable: false, icon: 'static/img/reddit.png'},
    {i18n: 'th15', col: 'ico_date_from', label: 'ICO START', show: true, sortable: false, icon: 'static/img/reddit.png'},
    {i18n: 'th16', col: 'ico_date_to', label: 'ICO END', show: true, sortable: false, icon: 'static/img/reddit.png'}
]

let THOUSAND = 1000
let MILLION = 1000000
let BILLION = 1000000000

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
        custom_choice: 'sssss',
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
]

let eventType = {
    'ICO': 'ICO',
    'Comments': '大事件'
}

let SITETYPE = {
    'btt': 1,
    'reddit': 2,
    'github': 3
}

let GRADE_ORDER = ["Donator", "Staff", 'Legendary', 'Hero Member',"Diamond Member", 'Sr. Member', 'Full Member', 'Jr. Member', 'Member' , 'Copper Member', 'Newbie']

export default {
    currencyHeads,
    currencyFilter,
    eventType,
    THOUSAND,
    MILLION,
    BILLION,
    SITETYPE,
    GRADE_ORDER
}
