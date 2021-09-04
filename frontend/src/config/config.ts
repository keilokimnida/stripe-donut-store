interface ConfigInterface {
    baseUrl: string,
    toastTiming: number
}

// src/config.js
const config: ConfigInterface = {
    baseUrl: "http://localhost:8000/api/v1",
    toastTiming: 2000
};
export default config;