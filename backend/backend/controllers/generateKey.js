const generateKey = () => {
    const timestamp = Date.now().toString(36); // Convert to base36 for shorter output
    const randomString = Math.random().toString(36).substring(2, 8); // 6-character random string
    return `${timestamp}-${randomString}`;
  };
  
  module.exports=generateKey;// Example: 'lxyccf-4jvkmw'
  