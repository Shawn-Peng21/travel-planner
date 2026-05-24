var map = new AMap.Map('container', {
            zoom: 12,
            center: [116.397428, 39.90923] // 默认北京
        });

        // 添加一个标记（天安门）
        var marker = new AMap.Marker({
            position: [116.397428, 39.90923],
            title: "测试景点"
        });

        map.add(marker);