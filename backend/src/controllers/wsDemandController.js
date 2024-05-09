const Position = require("../models/position");
const Notification = require("../models/notification");
const Nominee = require("../models/nominee");
const { getNomineeByPositionId } = require("./nomineeController");
const { findMatches } = require("../utils/matchingCv");
const { getNominees } = require("../utils/getNominees");
function initWebSocket(server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    io.on('connection', (socket) => {

        socket.on('createDemand', async (positionId) => {

            const position = await Position.findById(positionId);
            let nominees = [];
            const nomineePromises = position.requestedNominees.map(async (element) => {
                // Her bir nominee'nin belirli bir kimliği olduğunu varsayalım
                const reqNominee = await Nominee.findById(element);
                nominees.push(reqNominee); // Döngü içinde listeye ekleyin
            });
            const positions = await Position.find();
            // Tüm Promise'ların tamamlanmasını bekleyin
            await Promise.all(nomineePromises);

            // nominees dizisi artık tüm nominee'leri içerir

            let requestedCv = findMatches(position.skills, nominees);
            const response2 = await getNominees(positionId, true);

            io.emit('demandCreated', { allCVs: response2, id: positionId });
            io.emit('positionListUpdated', positions);
        });



        socket.on('notificationCreated', async (notificationId) => {

            const notification = await Notification.findById(notificationId);
            io.emit('createdNot', notification);
        })
        socket.on('notificationDeleted', async (deletedNotification) => {
            const positions = await Position.find();
            io.emit('positionListUpdated', positions);
            io.emit('deletedNot', deletedNotification);
        })
        socket.on('positionCreated', async (notificationId) => {
            const notification = await Notification.findById(notificationId);
            io.emit('createdPositionNot', notification);
        })
        socket.on('notificationRead' , (notificationId)=>{
            io.emit("readNot",notificationId);
        })
        socket.on('disconnect', () => {
        });
    });
}

module.exports = {
    initWebSocket,
};
