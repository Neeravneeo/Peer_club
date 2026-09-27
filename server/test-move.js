import { prisma } from './src/lib/prisma.js';

async function test() {
  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) { console.log("No users found"); return; }
  const user = users[0];

  const rooms = await prisma.studyRoom.findMany({ where: { adminId: user.id } });
  if (rooms.length < 2) { console.log("Need at least 2 rooms"); return; }

  const docs = await prisma.document.findMany({ where: { uploadedBy: user.id } });
  if (docs.length === 0) { console.log("No documents found"); return; }
  
  const doc = docs[0];
  const targetRoom = rooms[1];
  console.log("Moving doc", doc.id, "to room", targetRoom.id);

  const updatedDoc = await prisma.document.update({
    where: { id: doc.id },
    data: { roomId: targetRoom.id }
  });

  const roomWithDocs = await prisma.studyRoom.findUnique({
    where: { id: targetRoom.id },
    include: { documents: true }
  });
  
  console.log("Target room docs:", roomWithDocs.documents.length);
  console.log("Includes moved doc?", roomWithDocs.documents.some(d => d.id === doc.id));
}

test().catch(console.error).finally(() => process.exit(0));
