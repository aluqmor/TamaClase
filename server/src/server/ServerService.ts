import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { Directions, Player, PlayerStates } from '../player/entities/Player';
import { GameService } from '../game/GameService';
import { BoardBuilder } from '../game/BoardBuilder';
import { Board } from '../game/entities/Board';
import { RoomService } from '../room/RoomService';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active : boolean;
    private messages = [
        ""
    ]
    private rooms : [] = [];

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('hello', (data)=>{
            console.log(data);
        })

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", { status: true });
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));
            
            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
                RoomService.getInstance().removePlayer(GameService.getInstance().buildPlayer(socket));
            });
        });
    }

    public addPlayerToRoom(player : Socket, room: String) {
        player.join(room.toString());
    }

    public removePlayerFromRoom(player : Socket, room: String) {
        player.leave(room.toString());
    }

    public gameStartMessage() {
        this.io?.emit("gameStart", { message: "Game is starting!" });
    }

    public sendMap() {
        const map : Board = new BoardBuilder().getBoard();
        this.io?.emit("map", { map });
    }

    public isActive() {
        return this.active;
    }

    public reducer(message: String, action:{type: String, payload: any}) {
        switch (action.type) {
            case "sendMap":
                return [...message, action.payload];
            default:
                return message;
        }
    }
}