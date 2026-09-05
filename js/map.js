// js/map.js
let map;

function initMap() {
    map = new AMap.Map('container', {
        zoom: 14,
        center: [113.324520, 23.106680] // 默认中心点设为第一个景点
    });
}

function renderRouteOnMap(places) {
    if (!map) return;
    map.clearMap(); // 清除之前的覆盖物
    
    const path = [];
    
    places.forEach((place, index) => {
        // 1. 记录路径坐标
        path.push(place.location);
        
        // 2. 添加标记点
        new AMap.Marker({
            map: map,
            position: place.location,
            title: place.name,
            label: {
                content: `<div style="padding: 2px 5px; background: white; border-radius: 3px;">${index + 1}. ${place.name}</div>`,
                direction: 'top'
            }
        });
    });

    // 3. 绘制连接路线
    new AMap.Polyline({
        map: map,
        path: path,
        showDir: true, // 显示箭头方向
        strokeColor: "#3366FF", 
        strokeWeight: 6,
    });

    // 4. 自动缩放地图视野以包含所有景点
    map.setFitView();
}