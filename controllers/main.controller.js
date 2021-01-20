var testModel = require('../models/test.model')
var request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var csvHeader = [
    { id: 'country', title: "Country" },
    { id: 'league', title: "League" },
    { id: 'team', title: "Team" },
]
var scraping = false;
var token = 'a6e7278996032034fdcfbe7e985873617a2b1914';
class mainController {
    async index(req, res) {
        console.log('cosaisndex', csvHeader.length);
        res.send('value');
    }
    async start(req, res) {
        if (!scraping) {
            scraping = true;
            let cookie = '_ga=GA1.2.18893143.1589800820; _mkto_trk=id:180-PAY-466&token:_mch-wyscout.com-1589800823985-64128; wy_fingerprint=wnm4NSw9sePB4JDJeYEW3mmCqO36qqsD; aengine_remember_username=0; ajs_user_id=282762; ajs_anonymous_id=%22684f2fc6-6918-49ff-b6fe-ea9a073336a1%22; wy_analytics_prod=%7B%22personId%22:%22282762%22,%22platform%22:%22web%22,%22previousEvent%22:%22Video%20Selector%20Loaded%22,%22theme%22:%22light%22,%22version%22:%22v1.3.0%22,%22personName%22:%22Wyscout3%20RC%20DEPORTIVO%22,%22email%22:%22wyscout3@rcdeportivo.es%22,%22groupId%22:%22432%22,%22groupName%22:%22Deportivo%20la%20Coruna%22,%22subgroupId%22:%221865%22,%22subgroupName%22:%22Team%22,%22language%22:%22es%22,%22activeSubscriptionsIds%22:%5B%5D,%22activeSubscriptionsProviders%22:%5B%5D,%22paidSubscriptionsIds%22:%5B%5D,%22features%22:%5B%5D,%22products%22:%5B%5D,%22noOfAccounts%22:0,%22groupType%22:%22Club%22,%22groupCountry%22:%22Spain%22,%22isInternal%22:false%7D; aengine_dtk=a56edad979f2b409998afb97afb644d3c8a98b60; aengine_dtk_refresh=6d8a6495b95d31605b72bf6906e80b9dca23d893; AWSALB=sboP2LSrgIKw0zeug9lGQ9K9OUgy0D5RCn1Miijnog8ZdhoO/wfvWswZ6ijdnYe2/M0IVBFsPo6j9wLkMZHJa6ErBj6hEtCpN2ZQexKHSnKSV5XR+LdY1lklZRcC; AWSALBCORS=sboP2LSrgIKw0zeug9lGQ9K9OUgy0D5RCn1Miijnog8ZdhoO/wfvWswZ6ijdnYe2/M0IVBFsPo6j9wLkMZHJa6ErBj6hEtCpN2ZQexKHSnKSV5XR+LdY1lklZRcC';
            let query = '{"obj":"area","act":"list.other","params":{"key":0},"navi":{"component":"detail_0_home_navy1"}}'
            let countries = await getData(cookie, query);
            countries = countries.list;
            let csvData = [];
            let csvWriter = createCsvWriter({
                path: `all_leagues&teams.csv`,
                header: csvHeader,
                append: true
            });
            for (let i = 0; i < countries.length; i++) {
                let country = countries[i];
                let country_name = country.title
                console.log("mainController -> start -> country_name", country_name)
                let country_id = country.objId;
                let query_leagues = `{"obj":"competition","act":"list","params":{"areaId":${country_id},"key":0,"isMinor":0},"navi":{"owner":"detail_0_area_navy","component":"detail_0_area_navy_0"}}`
                let leagues = await getData(cookie, query_leagues);
                leagues = leagues.list;
                for (let j = 0; j < leagues.length; j++) {
                    let league = leagues[j];
                    let league_name = league.title;
                    console.log("mainController -> start -> league_name", league_name)
                    let league_id = league.objId;
                    if (league_id) {
                        let query_teams = `{"obj":"team","act":"list","params":{"key":0,"competitionId":${league_id}},"navi":{"owner":"detail_0_competition_navy","component":"detail_0_competition_navy_0"}}`
                        let teams = await getData(cookie, query_teams);
                        teams = teams.list;
                        for (let k = 0; k < teams.length; k++) {
                            let team = teams[k];
                            let team_name = team.title;
                            console.log("mainController -> start -> team_name", team_name)
                            let team_id = team.objId;
                            let data = {
                                country: country_name,
                                league: league_name,
                                team: team_id ? team_name : '- -'
                            }
                            csvData.push(data);
                        }
                    }
                }
                await csvWriter.writeRecords(csvData)       // returns a promise
                    .then(() => {
                        console.log('-------', country_name, 'Data added ----');
                    });
            }
            console.log('---------------- all done ------------')
            scraping = false;
            res.send('All done')
        }
    }
}

function getData(cookie, query) {
    let options = {
        method: "POST",
        url: 'https://platform.wyscout.com/app/aengine-service.php',
        headers: {
            cookie: cookie
        },
        formData: {
            query: query
        }
    }
    return new Promise((resolve, reject) => {
        request(options, function (err, response, body) {
            if (err) throw new Error(err);
            resolve(JSON.parse(body))
        })
    })
}

module.exports = mainController;