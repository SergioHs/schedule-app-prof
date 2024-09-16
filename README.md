# Projeto Next.js

Este é um projeto [Next.js](https://nextjs.org/) iniciado com [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Começando

Primeiro, execute o servidor de desenvolvimento:

    npm run dev

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `app/page.js`. A página será atualizada automaticamente à medida que você edita o arquivo.

Este projeto usa [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) para otimizar e carregar automaticamente a fonte Inter, uma fonte do Google personalizada.

## Configuração das Credenciais do Firebase

Para garantir que suas credenciais do Firebase permaneçam seguras e não sejam expostas no código-fonte, siga os passos abaixo:
    
 Na raiz do seu projeto, crie um arquivo chamado `.env.local` e adicione as seguintes variáveis de ambiente:
    

    NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave_api_do_firebase
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dominio_de_autenticacao_do_firebase
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=id_do_projeto_do_firebase
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bucket_de_armazenamento_do_firebase
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=id_do_remetente_de_mensagens_do_firebase
    NEXT_PUBLIC_FIREBASE_APP_ID=id_do_app_do_firebase
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=id_de_medição_do_firebase

   
       
**Atualizar a Configuração do Firebase**
    
 No arquivo onde você configura o Firebase, como `utils/firebase.js`, use as variáveis de ambiente:

    
   

       // utils/firebase.js
     const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            };
        

 
    
**Adicionar `.env.local` ao `.gitignore`**
    
  Adicione `.env.local` ao seu arquivo `.gitignore` para garantir que ele não seja incluído no controle de versão:

   **Reiniciar o Servidor de Desenvolvimento**
    
   Após criar ou modificar o arquivo `.env.local`, reinicie o servidor de desenvolvimento para que as novas variáveis de ambiente sejam carregadas:

    
    npm run dev
