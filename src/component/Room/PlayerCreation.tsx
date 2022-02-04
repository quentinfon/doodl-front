import React, { useState } from "react";
import { Button } from "antd";
import { IPlayer } from "../../types/game";

interface PlayerCreationProps {
    createPlayer: (player: IPlayer) => any,
    loadingConnexion: boolean
}

const PlayerCreation = ({
    createPlayer,
    loadingConnexion
} : PlayerCreationProps) => {

    const [player, setPlayer] = useState<IPlayer>({
        playerId: "",
        name: "Bob",
        imgUrl: "",
    })
    
    return (
        <>

            Pseudo :

            <Button 
                onClick={() => createPlayer(player)}
                disabled={loadingConnexion}
                loading={loadingConnexion}
            > 
                Connexion
            </Button>
        
        </>
    )

}

export default PlayerCreation;