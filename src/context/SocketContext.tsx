import { ReactNode, createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chatService } from "src/services";
// import { SocketValuesType } from "./types"

interface SocketValuesType {
    socket: any
    setSocket: any
}

const defaultProvider: SocketValuesType = {
    socket: null,
    setSocket: () => null,
}

export const SocketContext = createContext(defaultProvider)

type Props = {
    children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
    const [socket, setSocket] = useState<SocketValuesType['socket']>('idle')

    useEffect(() => {
        setSocket(io(chatService.connection()))
    }, [])

    const values = {
        socket,
        setSocket
    }

    return (
        <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
    )
}