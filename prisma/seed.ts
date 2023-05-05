import {
  genders,
  offices,
  posts,
  Prisma,
  PrismaClient,
  pronouns,
  sexualities,
  skincolor,
  topics,
} from "@prisma/client";
import { textOne, textTwo } from "./blogTexts";
const prisma = new PrismaClient();

async function main() {
  let topics: topics[] | Prisma.BatchPayload = await prisma.topics.findMany();
  let sexualities: sexualities[] | Prisma.BatchPayload = await prisma.sexualities.findMany();
  let genders: genders[] | Prisma.BatchPayload = await prisma.genders.findMany();
  let pronouns: pronouns[] | Prisma.BatchPayload = await prisma.pronouns.findMany();
  let offices: offices[] | Prisma.BatchPayload = await prisma.offices.findMany();
  let skincolor: skincolor[] | Prisma.BatchPayload = await prisma.skincolor.findMany();
  let posts: posts[] | Prisma.BatchPayload = await prisma.posts.findMany();
  let admin = await prisma.admins.findFirst();

  if (topics.length < 7) {
    await prisma.topics.deleteMany();

    topics = await prisma.topics.createMany({
      data: [
        { name: "Artigos de Opinião" },
        { name: "Íris News" },
        { name: "Entrevistas" },
        { name: "Íris Indica" },
        { name: "Íris Comenta" },
        { name: "Espaço das Artes" },
        { name: "Outros" },
      ],
    });
  }

  if (sexualities.length < 6) {
    await prisma.sexualities.deleteMany();

    sexualities = await prisma.sexualities.createMany({
      data: [
        { name: "Lésbica" },
        { name: "Gay" },
        { name: "Bissexual" },
        { name: "Pansexual" },
        { name: "Heterossexual" },
        { name: "Outro" },
      ],
    });
  }

  if (genders.length < 6) {
    await prisma.genders.deleteMany();

    genders = await prisma.genders.createMany({
      data: [
        { name: "Homem Trans" },
        { name: "Homem Cis" },
        { name: "Mulher Trans" },
        { name: "Mulher Cis" },
        { name: "Pessoa não-binaria" },
        { name: "Outro" },
      ],
    });
  }

  if (pronouns.length < 4) {
    await prisma.pronouns.deleteMany();

    pronouns = await prisma.pronouns.createMany({
      data: [{ name: "Ela/dela" }, { name: "Ele/dele" }, { name: "Elu/delu" }, { name: "Outro" }],
    });
  }

  if (offices.length < 13) {
    await prisma.offices.deleteMany();

    offices = await prisma.offices.createMany({
      data: [
        { name: "Designer" },
        { name: "Redator" },
        { name: "Criador de Conteúdo" },
        { name: "Gerente de Mentoria" },
        { name: "Gerente de Comunidade" },
        { name: "Coordenador adjunto de Habilidades Socioemocionais" },
        { name: "Auxiliar de mentoria - Oportunidades" },
        { name: "Auxiliar de mentoria - Habilidades socioemocionais" },
        { name: "Auxiliar de mentoria - Saúde Mental" },
        { name: "Consultor educacional - Oportunidades" },
        { name: "Auxiliar de Recursos Humanos" },
        { name: "Auxiliar de Relações Públicas" },
        { name: "Analista de Parcerias" },
      ],
    });
  }

  if (skincolor.length < 6) {
    await prisma.skincolor.deleteMany();

    skincolor = await prisma.skincolor.createMany({
      data: [
        { name: "Negro" },
        { name: "Branco" },
        { name: "Amarelo" },
        { name: "Pardo" },
        { name: "Indígena" },
        { name: "Outro" },
      ],
    });
  }

  if (!admin) {
    admin = await prisma.admins.create({
      data: {
        cpf: "15789465784",
        email: "admin@gmail.com",
        name: "Cintra",
        photo: "https://i.picasion.com/pic92/5b62d3850d659c5e4917c29d9f35525a.gif",
        birthDay: new Date("2000-01-01"),
        password: "123456789",
      },
    });

    await prisma.admin_sessions.create({
      data: {
        adminId: admin.id,
        token: "1@FP24B6TP8EgoXu1se^uH",
      },
    });
  }

  if (posts.length < 5) {
    await prisma.posts.deleteMany();
    const findTopics = await prisma.topics.findMany({});

    posts = await prisma.posts.createMany({
      data: [
        {
          adminId: admin.id,
          title: "Sorofobia",
          topicId: findTopics[0].id,
          text: textOne,
          image: "https://i.imgur.com/YFby08q.png",
        },
        {
          adminId: admin.id,
          title: `"Você é muito jovem para saber"`,
          topicId: findTopics[1].id,
          text: textTwo,
          image: "https://i.imgur.com/u4Kc3Lu.png",
        },
      ],
    });
  }

  console.log({ sexualities, genders, pronouns, posts, admin });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
