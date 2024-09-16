import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', 
    register: true, 
    sw: 'service-worker.js',
});

export default nextConfig;
