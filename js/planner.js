// js/planner.js
function optimizeRoute(places) {
    if (!places || places.length <= 1) return places;

    let unvisited = [...places];
    let optimizedPath = [];
    
    // 假设以第一个景点作为起点
    let currentPlace = unvisited.shift();
    optimizedPath.push(currentPlace);

    while (unvisited.length > 0) {
        let nearestIndex = 0;
        let minDistance = Infinity;

        // 遍历剩余未访问的节点，寻找距离当前节点最近的下一个节点
        for (let i = 0; i < unvisited.length; i++) {
            const dist = AMap.GeometryUtil.distance(
                currentPlace.location, 
                unvisited[i].location
            );
            
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = i;
            }
        }

        // 将最近的节点加入已优化路径，并更新当前节点
        currentPlace = unvisited.splice(nearestIndex, 1)[0];
        optimizedPath.push(currentPlace);
    }

    return optimizedPath;
}