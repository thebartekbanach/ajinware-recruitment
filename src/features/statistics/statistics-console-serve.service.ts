import { Injectable } from "@nestjs/common"

@Injectable()
export class StatisticsConsoleServeService {
    serveStatisticsPage() {
        return `
<!-- PLEASE NOTE THAT THIS FILE HAS BEEN HAND WRITTEN ONLY FOR THE PURPOSE OF THIS RECRUITMENT TASK -->
<!-- THIS IS NOT A PRODUCTION READY CODE -->
<!-- I KNOW HOW TO WRITE FRONTEND IN REACT, BUT FOR SIMPLICITY I DECIDED TO USE VANILLA JS -->

<!DOCTYPE html>
<html>
<head>
    <title>Statistics Console</title>
</head>
<body>
    <h1>Statistics Console</h1>
    <p>Live statistics updates will appear here</p>
    <div style="padding-bottom: 15px; border-top: 1px solid #333; width: 100vw"></div>
    <code id="statistics">No data yet</code>

    <script>
        const protocol = "ws://"
        const domain = window.location.hostname + (window.location.port ? ':' + window.location.port : '')
        const path = "/statistics/live"

        const statisticsData = []
        const statisticsElement = document.getElementById("statistics")

        const prepareCoasterReport = (coaster) => {
            if (coaster.numberOfClientsCanBeServedDaily < coaster.numberOfClientsDaily) {
                return "Problem: zbyt mało wagonów do obsłużenia wszystkich klientów"
            }

            if (coaster.availablePersonnelNumber < coaster.expectedPersonnelNumber) {
                return "Problem: zbyt mało personelu, proszę dodać personel do kolejki"
            }

            if (coaster.numberOfClientsCanBeServedDaily > coaster.numberOfClientsDaily * 2) {
                return "Problem: zbyt dużo wolnych miejsc, proszę usunąć wagony"
            }

            return "Status: OK"
        }

        const renderStatistics = () => {
            const time = new Date().toLocaleTimeString()
            const header = "<b>[Ostatnia aktualizacja " + time + "]</b><br><br>"
            const statistics = statisticsData.map((stat) => {
                return [
                    "<b>[Kolejka " + stat.id + "]</b>",
                    "Godziny działania: " + stat.openHour + " - " + stat.closeHour,
                    "Liczba wagonów: " + stat.availableWagonsNumber,
                    "Dostępny personel: " + stat.availablePersonnelNumber + "/" + stat.expectedPersonnelNumber,
                    "Klienci dziennie: " + stat.numberOfClientsDaily + "/" + stat.numberOfClientsCanBeServedDaily,
                    prepareCoasterReport(stat)
                ].join("<br>&nbsp;&nbsp;&nbsp;&nbsp;")

            }).join("<br><br>")

            statisticsElement.innerHTML = header + statistics
        }

        const addOrReplaceStatistic = (event) => {
            const stat = JSON.parse(event.data)
            console.log("Received statistic", stat)

            for (let i = 0; i < statisticsData.length; i++) {
                if (statisticsData[i].id === stat.id) {
                    statisticsData[i] = stat
                    renderStatistics()
                    return
                }
            }

            statisticsData.push(stat)
            renderStatistics()
        }

        const loadInitialData = () => {
            fetch("/statistics/latest")
                .then((response) => response.json())
                .then((data) => {
                    statisticsData.push(...data)
                    renderStatistics()
                })
        }

        const connectToLiveWebsocket = () => {
            const ws = new WebSocket(protocol + domain + path)
            ws.onmessage = addOrReplaceStatistic
            ws.onclose = () => alert("Connection to statistics server closed, please refresh the page")
        }

        connectToLiveWebsocket()
        loadInitialData()
    </script>
</body>
</html>
        `
    }
}
