export const widgetCardsConfig:VizWidgetBaseConfig[] = [
    {
        title: 'Transactions', 
        chartType: 'bar', 
        description: 'Amount C/D over Time',
        groupByKey: 'transactionDate',
        valueByKey: 'amount',
        options:{
            splitBy:{
                param: 'mode',
                value: ['DEBITED', 'CREDITED'],
                color: ['--error-color', '--success-color']
            },
        }
    },
    {
        title: 'Transactions', 
        chartType: 'line', 
        description: 'Amount C/D over Time',
        groupByKey: 'transactionDate',
        valueByKey: 'amount',
        options:{
                    splitBy:{
                param: 'mode',
                value: ['DEBITED', 'CREDITED'],
                color: ['--error-color', '--success-color']
            },
        }
    },
    {
        title: 'Spend By Category', 
        chartType: 'line', 
        description: '',
         groupByKey: 'expenseCategory',
        valueByKey: 'amount',
        options: {
                    splitBy:{
                param: 'mode',
                value: ['DEBITED', 'CREDITED'],
                color: ['--error-color', '--success-color']
            },
        }
    },
    {
        title: 'Transaction by sender/receiver', 
        chartType: 'bar', 
        description: 'Description-4',
        groupByKey: 'senderOrReceiver',
        valueByKey: 'amount',
        options:{
                    splitBy:{
                param: 'mode',
                value: ['DEBITED','CREDITED'],
                color: ['--error-color', '--success-color']
            },
        }
    },
    // {
    //     title: 'Test-5', 
    //     chartType: 'bar', 
    //     description: 'Description-5',
    //     options:{}
    // },
    //  {
    //     title: 'StackedBar', 
    //     chartType: 'bar', 
    //     description: 'Description-5',
    //     groupByKey: 'transactionDate',
    //     valueByKey: 'amount',
    //     options:{
    //         stackBy:{
    //             param: 'expenseCategory',
    //             // value: ['DEBITED','CREDITED'],
    //             // color: ['--error-color', '--success-color']
    //         },
    //     }
    // },
]