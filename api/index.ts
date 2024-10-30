const apiKey = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;

const apiUrl = `https://pixabay.com/api/?key=${apiKey}`;

const formatUrl = (params: Record<string, string | number>) => {
  let url = apiUrl + '&per_page=25&safeSearch=true&editors_choice=true';
  if (!params) return url;

  let paramKeys = Object.keys(params);

  paramKeys.forEach((key) => {
    let value =
      key === 'q' ? encodeURIComponent(String(params[key])) : params[key];
    url += `&${key}=${value}`;
  });

  console.log('final url', url);
  return url;
};

export const apiCall = async (params: Record<string, string | number>) => {
  try {
    let response = await fetch(formatUrl(params));
    response = await response.json();

    return { success: true, data: response };
  } catch (error: any) {
    console.log(error);

    return { success: false, msg: error.message };
  }
};
