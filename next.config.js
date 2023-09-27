/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"], // домен "utfs.io". Это значит, что изображения с этого домена будут доверенными и не будут подвергаться политике Same-Origin Policy (SOP), это позволит загружать их.
  },
};

module.exports = nextConfig;
