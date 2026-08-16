export const widgetCardsConfig:VizWidgetBaseConfig[] = [
    {
        title: 'Test-1', 
        chartType: 'bar', 
        description: 'Description-1',
        groupByKey: 'transactionDate',
        valueByKey: 'amount',
        options:{
            // splitBy:{
            //     param: 'mode',
            //     value: ['DEBITED', 'CREDITED'],
            //     color: ['--error-color', '--success-color']
            // },
        }
    },
    {
        title: 'Test-2', 
        chartType: 'line', 
        description: 'Description-2',
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
        title: 'Test-3', 
        chartType: 'bar', 
        description: 'Description-3',
        options: {
           
            xAxis: ''
        }
    },
    {
        title: 'Test-4', 
        chartType: 'pie', 
        description: 'Description-4',
        groupByKey: 'paymentMode',
        valueByKey: 'amount',
        options:{}
    },
    {
        title: 'Test-5', 
        chartType: 'bar', 
        description: 'Description-5',
        options:{}
    },
]