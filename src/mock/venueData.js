let venueData = [
                {
                name: '백소정',
                storeType: 'restaurant', 
                dealType: 'time',
                likes: 100,
                recommendations: 79,
                record: 5,
                },
                {
                name: '대관령',
                storeType: 'bar',
                dealType: 'service',
                likes: 50,
                recommendations: 99,
                record: 3,
                },
                {
                name: '오후홍콩',
                storeType: 'cafe',
                dealType: 'review',
                likes: 70,
                record: 7,
                recommendations: 29,
                },
                {
                name: '가',
                storeType: 'cafe',
                dealType: 'sale',
                likes: 20,
                record: 12,
                recommendations: 39,
                },
                {
                name: '나',
                storeType: 'cafe',
                dealType: 'review',
                likes: 30,
                recommendations: 49,
                record: 8,
                }
            ];

export default [
    {
        url: '/api/stores',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: 'success',
                data: venueData,
            }
        }
    },
]
