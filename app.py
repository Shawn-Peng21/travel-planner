from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from openai import OpenAI

app = Flask(__name__)
CORS(app) # 允许跨域，让前端可以调用本地的 5000 端口

# 1. 填入你在硅基流动复制的 API 密钥
AI_API_KEY = "sk-jjwhgpzzlgdztjndqtgqmhumjenlwkioafkquauclynoraop"
# 2. 填入你刚刚申请的高德【Web服务】API Key
GAODE_SERVER_KEY = "bff4fc36a471cf7d1277010a2b39d0fd"

# 初始化客户端，指向硅基流动的服务器
client = OpenAI(
    api_key=AI_API_KEY, 
    base_url="https://api.siliconflow.cn/v1"
)

def get_coordinates(place_name, city):
    """调用高德 Web 服务 API 将景点名称转换为精确经纬度"""
    url = f"https://restapi.amap.com/v3/geocode/geo?address={place_name}&city={city}&key={GAODE_SERVER_KEY}"
    try:
        response = requests.get(url, timeout=5).json()
        if response.get('status') == '1' and response.get('geocodes'):
            location_str = response['geocodes'][0]['location']
            return [float(coord) for coord in location_str.split(',')]
    except Exception as e:
        print(f"坐标获取失败 {place_name}: {e}")
    return None

@app.route('/api/plan', methods=['POST'])
def generate_plan():
    data = request.json
    destination = data.get('destination')
    days = data.get('days')

    # 构建 Prompt：严格限制输出格式，避免大模型输出多余废话导致切片失败
    prompt = f"请为{destination}规划一个{days}天的旅游计划。只需按游玩顺序输出真实存在的景点名称，用英文逗号分隔，不要任何多余解释、换行或标点。例如：清晖园,顺峰山公园,欢乐海岸PLUS"
    
    try:
        # 调用硅基流动的免费千问模型
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3 # 降低随机性，保证输出格式稳定
        )
        
        places_str = completion.choices[0].message.content
        print(f"AI 原始输出: {places_str}") # 打印在控制台方便调试
        
        # 将逗号分隔的字符串切割为列表，并去除两端空格
        place_names = [name.strip() for name in places_str.split(',') if name.strip()]

        real_plan = []
        for index, name in enumerate(place_names):
            coords = get_coordinates(name, destination)
            if coords:
                real_plan.append({
                    "id": index + 1,
                    "name": name,
                    "location": coords
                })

        return jsonify(real_plan)

    except Exception as e:
        print(f"AI 调用失败: {e}")
        return jsonify({"error": "路线生成失败，请重试"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)