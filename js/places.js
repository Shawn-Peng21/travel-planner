// js/places.js
async function fetchAttractions(destination, days, budget) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                destination: destination,
                days: days,
                budget: budget
            })
        });
        
        if (!response.ok) throw new Error("网络请求失败");
        return await response.json();
    } catch (error) {
        console.error("无法获取 AI 路线数据:", error);
        return [];
    }
}