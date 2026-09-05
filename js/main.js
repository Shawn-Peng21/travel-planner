// js/main.js
window.onload = function() {
    // 1. 初始化地图，依然保留在最外层，确保页面一打开就显示地图底座
    initMap();

    // 2. 监听控制面板中“生成专属路线”按钮的点击事件
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const destination = document.getElementById('destination').value;
        const days = document.getElementById('days').value;
        const budget = document.getElementById('budget').value;

        // 简单的输入校验
        if (!destination) {
            alert("请至少输入目的地！");
            return;
        }

        // 修改按钮状态，防止用户重复点击，并提供加载反馈
        const btn = document.getElementById('generate-btn');
        btn.innerText = "正在规划路线...";
        btn.disabled = true;

        try {
            // 获取原始景点数据 (目前读取本地 JSON)
            const rawPlaces = await fetchAttractions(destination, days, budget);
            
            // 核心变动：将无序的数据送入 planner.js 的算法中进行最短路径排序
            const optimizedPlaces = optimizeRoute(rawPlaces);

            // 将排序后的景点交给 map.js 进行打点和连线
            if (optimizedPlaces && optimizedPlaces.length > 0) {
                renderRouteOnMap(optimizedPlaces);
            } else {
                console.warn("未获取到有效的路线数据");
            }
        } catch (error) {
            console.error("路线生成失败:", error);
            alert("路线生成失败，请检查控制台报错。");
        } finally {
            // 无论成功还是失败，最后都要恢复按钮的初始状态
            btn.innerText = "生成专属路线";
            btn.disabled = false;
        }
    });
};