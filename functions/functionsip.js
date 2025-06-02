// functions/ip.js - 处理 IP 查询的 API 函数
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const ipPath = url.pathname.split('/api/ip/')[1] || '';
    
    // 如果用户提供了IP，验证其格式
    if (ipPath && !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipPath)) {
      return new Response(JSON.stringify({ error: '无效的IP地址格式' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const clientIp = ipPath || request.headers.get('CF-Connecting-IP');
    
    // 如果无法获取IP地址
    if (!clientIp) {
      return new Response(JSON.stringify({ error: '无法确定IP地址' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const ipInfo = {
      ip: clientIp,
      country: request.headers.get('CF-IPCountry') || '未知',
      region: request.headers.get('CF-Region') || request.headers.get('CF-IPRegion') || '未知',
      city: request.headers.get('CF-IPCity') || '未知',
      isp: request.headers.get('CF-IPASN-Organization') || '未知',
      asn: request.headers.get('CF-IPASN') ? `AS${request.headers.get('CF-IPASN')}` : '未知',
      vpn: request.headers.get('CF-IPIsVPN') === '1',
      tor: request.headers.get('CF-IPIsTor') === '1',
      proxy: request.headers.get('CF-IPIsProxy') === '1',
      userAgent: request.headers.get('User-Agent') || '未知'
    };
    
    return new Response(JSON.stringify(ipInfo, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('处理IP请求时出错:', error);
    return new Response(JSON.stringify({ error: '服务器内部错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}