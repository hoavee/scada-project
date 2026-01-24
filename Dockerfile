FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy nội dung từ standalone vào /app
COPY .next/standalone ./
# Copy static vào đúng folder .next/static bên trong /app
COPY .next/static ./.next/static
# Copy public vào /app/public
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]