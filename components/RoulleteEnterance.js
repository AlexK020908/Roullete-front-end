import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit" //this hook gives a call called dispatch

//we use this to get the chainid
export default function RoulleteEnterance() {
    //let fee = ""; can not do this, because when we update fee , it will not trigger a re-render--> that is why we use use-state
    console.log(`imported contract addresses ${JSON.stringify(contractAddresses)}`)
    const [fee, setFee] = useState("0")
    const [redPlayersSize, setRedPlayers] = useState("0")
    const [blackPlayersSize, setBlackPlayers] = useState("0")
    const [greenPlayersSize, setgreenPlayers] = useState("0")
    const [winnningColor, setWinningColor] = useState("")
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const roulleteAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(`roullete address is ${roulleteAddress}`)
    console.log(parseInt(chainIdHex))
    const dispatch = useNotification()
    //the reason moralis knows what chain we are on,
    //the header passes all the info about metamask to the moralis provider

    //then the provider in app passes the info down to the whole app
    const {
        runContractFunction: enterRed,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "enterRed",
        args: {},
        msgValue: fee,
        //what is msg.value? --> it is out entrance fee! we only want to update this var when web 3 is enabled --> that is why we use isWeb3Enabled
        // use "useEfFECT"
    })
    const { runContractFunction: enterBlack } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "enterBlack",
        args: {},
        msgValue: fee,
    })

    const { runContractFunction: enterGreen } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "enterGreen",
        args: {},
        msgValue: fee,
    })

    const { runContractFunction: getEntraceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress, // specify the networkId
        functionName: "getEntraceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayersOfBlack } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "getNumberOfPlayersOfBlack",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayersOfRed } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "getNumberOfPlayersOfRed",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayersOfGreen } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "getNumberOfPlayersOfGreen",
        params: {},
    })

    // const { runContractFunction: amountOfWinners } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress,
    //     functionName: "amountOfWinners",
    //     params: {},
    // })

    const { runContractFunction: getLatestColor } = useWeb3Contract({
        abi: abi,
        contractAddress: roulleteAddress,
        functionName: "getLatestColor",
        params: {},
    })

    async function updateUi() {
        const temp = (await getEntraceFee()).toString()
        setFee(temp)
        //why can't we use ethers.utils.parseEther?
        // setFee(ethers.utils.parseEther(temp));
        console.log(fee)
        const blackPlayersSize = (await getNumberOfPlayersOfBlack()).toString()
        const redPlayersSize = (await getNumberOfPlayersOfRed()).toString()
        const greenplayersSize = (await getNumberOfPlayersOfGreen()).toString()
        const winningColor = await getLatestColor()
        setgreenPlayers(greenplayersSize)
        setBlackPlayers(blackPlayersSize)
        setRedPlayers(redPlayersSize)
        setWinningColor(winningColor)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read entrance fee
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "transaction complete",
            title: "tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }
    return (
        <div className="p-5">
            {roulleteAddress ? (
                <div>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2 ml-auto"
                        onClick={async () =>
                            await enterRed({
                                //note that this does not automatically updat the winner, becuase success if tied to enter raffle,
                                //we need to tie a listner to listen for the winner event so we can trigger a re-render
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        Bet on Red
                    </button>

                    <button
                        className="bg-green-500 hover:bg-green-700 text-black font-bold rounded p-2 ml-auto"
                        onClick={async () =>
                            await enterGreen({
                                //note that this does not automatically updat the winner, becuase success if tied to enter raffle,
                                //we need to tie a listner to listen for the winner event so we can trigger a re-render
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        Bet on green
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-black-700 text-white font-bold rounded p-2 ml-auto"
                        onClick={async () =>
                            await enterBlack({
                                //note that this does not automatically updat the winner, becuase success if tied to enter raffle,
                                //we need to tie a listner to listen for the winner event so we can trigger a re-render
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        Bet on Black
                    </button>
                    <div>Entrance Fee : {ethers.utils.formatUnits(fee, "ether")}</div>
                    <div>Black Bets:{blackPlayersSize}</div>
                    <div>Red bets:{redPlayersSize}</div>
                    <div>green bets:{greenPlayersSize}</div>
                    <div>Last Color: {winnningColor} </div>
                </div>
            ) : (
                <div> No Roullete Address </div>
            )}
        </div>
    )
}
