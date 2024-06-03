document.addEventListener('DOMContentLoaded', function() {
    // Inject a content script into the active tab to get the page name, visitors, conversions, and final data for all variants
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                func: () => {
                    const getTextContent = (selector) => {
                        const element = document.querySelector(selector);
                        return element ? element.textContent : null;
                    };

                    const getVisitorConversionData = (id) => {
                        const visitors = getTextContent(`span[data-testid="visitors-${id}"]`);
                        const conversions = getTextContent(`span[data-testid="conversion-number-${id}"]`);
                        return { visitors, conversions };
                    };

                    const getFinalData = (variantName) => {
                        const variantDiv = document.querySelector(`div[data-testid*="variant-name-${variantName}"]`);
                        if (!variantDiv) return { finalVisitors: null, finalConversions: null };

                        const title = variantDiv.getAttribute('title');
                        const finalVisitorsMatch = title.match(/(\d+)\.csV/);
                        const finalConversionsMatch = title.match(/(\d+)\.csC/);

                        const finalVisitors = finalVisitorsMatch ? finalVisitorsMatch[1] : null;
                        const finalConversions = finalConversionsMatch ? finalConversionsMatch[1] : null;

                        return { finalVisitors, finalConversions };
                    };

                    const pageName = getTextContent('h2[data-testid="page-name"]');

                    const allDivs = Array.from(document.querySelectorAll('div[data-testid*="variant-id-"], div[data-testid="inactive-section"]'));
                    const activeVariantDivs = [];
                    for (let div of allDivs) {
                        if (div.getAttribute('data-testid') === 'inactive-section') break;
                        if (div.getAttribute('data-testid').includes('variant-id-')) {
                            activeVariantDivs.push(div.getAttribute('data-testid').replace('variant-id-', ''));
                        }
                    }

                    const champVariantId = activeVariantDivs.length > 0 ? activeVariantDivs[0] : null;
                    const challengerVariantIds = activeVariantDivs.slice(1, 11); // Take up to 10 occurrences after the first one

                    const data = {
                        pageName,
                        champVariantId,
                        challengerVariantIds,
                        champData: champVariantId ? getVisitorConversionData(champVariantId) : null,
                        v1Data: challengerVariantIds[0] ? getVisitorConversionData(challengerVariantIds[0]) : null,
                        v2Data: challengerVariantIds[1] ? getVisitorConversionData(challengerVariantIds[1]) : null,
                        v3Data: challengerVariantIds[2] ? getVisitorConversionData(challengerVariantIds[2]) : null,
                        v4Data: challengerVariantIds[3] ? getVisitorConversionData(challengerVariantIds[3]) : null,
                        v5Data: challengerVariantIds[4] ? getVisitorConversionData(challengerVariantIds[4]) : null,
                        v6Data: challengerVariantIds[5] ? getVisitorConversionData(challengerVariantIds[5]) : null,
                        v7Data: challengerVariantIds[6] ? getVisitorConversionData(challengerVariantIds[6]) : null,
                        v8Data: challengerVariantIds[7] ? getVisitorConversionData(challengerVariantIds[7]) : null,
                        v9Data: challengerVariantIds[8] ? getVisitorConversionData(challengerVariantIds[8]) : null,
                        v10Data: challengerVariantIds[9] ? getVisitorConversionData(challengerVariantIds[9]) : null,
                        finalV1Data: challengerVariantIds[0] ? getFinalData(challengerVariantIds[0]) : null,
                        finalV2Data: challengerVariantIds[1] ? getFinalData(challengerVariantIds[1]) : null,
                        finalV3Data: challengerVariantIds[2] ? getFinalData(challengerVariantIds[2]) : null,
                        finalV4Data: challengerVariantIds[3] ? getFinalData(challengerVariantIds[3]) : null,
                        finalV5Data: challengerVariantIds[4] ? getFinalData(challengerVariantIds[4]) : null,
                        finalV6Data: challengerVariantIds[5] ? getFinalData(challengerVariantIds[5]) : null,
                        finalV7Data: challengerVariantIds[6] ? getFinalData(challengerVariantIds[6]) : null,
                        finalV8Data: challengerVariantIds[7] ? getFinalData(challengerVariantIds[7]) : null,
                        finalV9Data: challengerVariantIds[8] ? getFinalData(challengerVariantIds[8]) : null,
                        finalV10Data: challengerVariantIds[9] ? getFinalData(challengerVariantIds[9]) : null

                    };

                    return data;
                }
            },
            (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;

                    if (data.champVariantId) document.getElementById('champname').value = data.champVariantId;
                    if (data.challengerVariantIds[0]) document.getElementById('v1name').value = data.challengerVariantIds[0];
                    if (data.challengerVariantIds[1]) document.getElementById('v2name').value = data.challengerVariantIds[1];
                    if (data.challengerVariantIds[2]) document.getElementById('v3name').value = data.challengerVariantIds[2];
                    if (data.challengerVariantIds[3]) document.getElementById('v4name').value = data.challengerVariantIds[3];
                    if (data.challengerVariantIds[4]) document.getElementById('v5name').value = data.challengerVariantIds[4];
                    if (data.challengerVariantIds[5]) document.getElementById('v6name').value = data.challengerVariantIds[5];
                    if (data.challengerVariantIds[6]) document.getElementById('v7name').value = data.challengerVariantIds[6];
                    if (data.challengerVariantIds[7]) document.getElementById('v8name').value = data.challengerVariantIds[7];
                    if (data.challengerVariantIds[8]) document.getElementById('v9name').value = data.challengerVariantIds[8];
                    if (data.challengerVariantIds[9]) document.getElementById('v10name').value = data.challengerVariantIds[9];

                    document.getElementById('pageName').value = data.pageName;

                    if (data.champData) {
                        document.getElementById('champcurrentVisitors').value = data.champData.visitors;
                        document.getElementById('champcurrentConversions').value = data.champData.conversions;
                    }

                    if (data.v1Data) {
                        document.getElementById('v1currentVisitors').value = data.v1Data.visitors;
                        document.getElementById('v1currentConversions').value = data.v1Data.conversions;
                    }

                    if (data.v2Data) {
                        document.getElementById('v2currentVisitors').value = data.v2Data.visitors;
                        document.getElementById('v2currentConversions').value = data.v2Data.conversions;
                    }

                    if (data.v3Data) {
                        document.getElementById('v3currentVisitors').value = data.v3Data.visitors;
                        document.getElementById('v3currentConversions').value = data.v3Data.conversions;
                    }

                    if (data.v4Data) {
                        document.getElementById('v4currentVisitors').value = data.v4Data.visitors;
                        document.getElementById('v4currentConversions').value = data.v4Data.conversions;
                    }

                    if (data.v5Data) {
                        document.getElementById('v5currentVisitors').value = data.v5Data.visitors;
                        document.getElementById('v5currentConversions').value = data.v5Data.conversions;
                    }

                    if (data.v6Data) {
                        document.getElementById('v6currentVisitors').value = data.v6Data.visitors;
                        document.getElementById('v6currentConversions').value = data.v6Data.conversions;
                    }

                    if (data.v7Data) {
                        document.getElementById('v7currentVisitors').value = data.v7Data.visitors;
                        document.getElementById('v7currentConversions').value = data.v7Data.conversions;
                    }

                    if (data.v8Data) {
                        document.getElementById('v8currentVisitors').value = data.v8Data.visitors;
                        document.getElementById('v8currentConversions').value = data.v8Data.conversions;
                    }

                    if (data.v9Data) {
                        document.getElementById('v9currentVisitors').value = data.v9Data.visitors;
                        document.getElementById('v9currentConversions').value = data.v9Data.conversions;
                    }

                    if (data.v10Data) {
                        document.getElementById('v10currentVisitors').value = data.v10Data.visitors;
                        document.getElementById('v10currentConversions').value = data.v10Data.conversions;
                    }

                    if (data.finalV1Data) {
                        if (data.finalV1Data.finalVisitors) {
                            document.getElementById('champstartingVisitors1').value = data.finalV1Data.finalVisitors;
                        }
                        if (data.finalV1Data.finalConversions) {
                            document.getElementById('champstartingConversions1').value = data.finalV1Data.finalConversions;
                        }
                    }

                    if (data.finalV2Data) {
                        if (data.finalV2Data.finalVisitors) {
                            document.getElementById('champstartingVisitors2').value = data.finalV2Data.finalVisitors;
                        }
                        if (data.finalV2Data.finalConversions) {
                            document.getElementById('champstartingConversions2').value = data.finalV2Data.finalConversions;
                        }
                    }

                    if (data.finalV3Data) {
                        if (data.finalV3Data.finalVisitors) {
                            document.getElementById('champstartingVisitors3').value = data.finalV3Data.finalVisitors;
                        }
                        if (data.finalV3Data.finalConversions) {
                            document.getElementById('champstartingConversions3').value = data.finalV3Data.finalConversions;
                        }
                    }

                    if (data.finalV4Data) {
                        if (data.finalV4Data.finalVisitors) {
                            document.getElementById('champstartingVisitors4').value = data.finalV4Data.finalVisitors;
                        }
                        if (data.finalV4Data.finalConversions) {
                            document.getElementById('champstartingConversions4').value = data.finalV4Data.finalConversions;
                        }
                    }

                    if (data.finalV5Data) {
                        if (data.finalV5Data.finalVisitors) {
                            document.getElementById('champstartingVisitors5').value = data.finalV5Data.finalVisitors;
                        }
                        if (data.finalV5Data.finalConversions) {
                            document.getElementById('champstartingConversions5').value = data.finalV5Data.finalConversions;
                        }
                    }

                    if (data.finalV6Data) {
                        if (data.finalV6Data.finalVisitors) {
                            document.getElementById('champstartingVisitors6').value = data.finalV6Data.finalVisitors;
                        }
                        if (data.finalV6Data.finalConversions) {
                            document.getElementById('champstartingConversions6').value = data.finalV6Data.finalConversions;
                        }
                    }

                    if (data.finalV7Data) {
                        if (data.finalV7Data.finalVisitors) {
                            document.getElementById('champstartingVisitors7').value = data.finalV7Data.finalVisitors;
                        }
                        if (data.finalV7Data.finalConversions) {
                            document.getElementById('champstartingConversions7').value = data.finalV7Data.finalConversions;
                        }
                    }

                    if (data.finalV8Data) {
                        if (data.finalV8Data.finalVisitors) {
                            document.getElementById('champstartingVisitors8').value = data.finalV8Data.finalVisitors;
                        }
                        if (data.finalV8Data.finalConversions) {
                            document.getElementById('champstartingConversions8').value = data.finalV8Data.finalConversions;
                        }
                    }

                    if (data.finalV9Data) {
                        if (data.finalV9Data.finalVisitors) {
                            document.getElementById('champstartingVisitors9').value = data.finalV9Data.finalVisitors;
                        }
                        if (data.finalV9Data.finalConversions) {
                            document.getElementById('champstartingConversions9').value = data.finalV9Data.finalConversions;
                        }
                    }

                    if (data.finalV10Data) {
                        if (data.finalV10Data.finalVisitors) {
                            document.getElementById('champstartingVisitors10').value = data.finalV10Data.finalVisitors;
                        }
                        if (data.finalV10Data.finalConversions) {
                            document.getElementById('champstartingConversions10').value = data.finalV10Data.finalConversions;
                        }
                    }
                }

                // Hide rows if variant names are empty
                const variantNames = ['v1name', 'v2name', 'v3name', 'v4name', 'v5name', 'v6name', 'v7name', 'v8name', 'v9name', 'v10name'];
                const variantRows = ['v1tr', 'v2tr', 'v3tr', 'v4tr', 'v5tr', 'v6tr', 'v7tr', 'v8tr', 'v9tr', 'v10tr'];

                let allVariantsEmpty = true;
                variantNames.forEach((variantName, index) => {
                    const variantValue = document.getElementById(variantName).value;
                    if (!variantValue) {
                        document.getElementById(variantRows[index]).style.display = 'none';
                    } else {
                        allVariantsEmpty = false;
                    }
                });

                if (allVariantsEmpty) {
                    document.getElementById('pageName').style.display = 'none';
                    document.getElementById('champtr').style.display = 'none';
                    document.getElementById('headerstr').style.display = 'none';
                    document.getElementById('footer').style.display = 'none';
                    const message = document.createElement('p');
                    message.className = 'offsite';
                    message.innerHTML = 'Go to an <a href="https://app.unbounce.com/users/sign_in" target="_blank" class="unbounce">Unbounce</a> page that has at least one active variant to view your page stats.';
                    document.querySelector('.container').appendChild(message);
                }

                // Proceed with calculations after updating the input fields
                const champCurrentVisitors = parseFloat(document.getElementById('champcurrentVisitors').value);
                const champCurrentConversions = parseFloat(document.getElementById('champcurrentConversions').value);

                for (let i = 1; i <= 10; i++) {
                    const variantCurrentVisitorsInput = document.getElementById(`v${i}currentVisitors`);
                    const variantCurrentVisitors = parseFloat(variantCurrentVisitorsInput.value);
                    if (!variantCurrentVisitors) {
                        document.getElementById(`v${i}Result`).value = '';
                        continue;
                    }
                    const variantCurrentConversions = parseFloat(document.getElementById(`v${i}currentConversions`).value);
                    const champStartingVisitors = parseFloat(document.getElementById(`champstartingVisitors${i}`).value);
                    const champStartingConversions = parseFloat(document.getElementById(`champstartingConversions${i}`).value);

                    const champConversionRate = (champCurrentConversions - champStartingConversions) / (champCurrentVisitors - champStartingVisitors) * 100;
                    const variantConversionRate = (variantCurrentConversions / variantCurrentVisitors) * 100;

                    document.getElementById(`champcurrentconversionRate${i}`).value = `${champConversionRate.toFixed(2)}%`;
                    document.getElementById(`v${i}currentconversionRate`).value = `${variantConversionRate.toFixed(2)}%`;

                    let resultElement = document.getElementById(`v${i}Result`);
                    if (variantCurrentVisitors < 50) {
                        resultElement.value = 'ANALYZING';
                        resultElement.style.backgroundColor = 'yellow';
                    } else if (variantConversionRate > champConversionRate) {
                        resultElement.value = 'WINNING';
                        resultElement.style.backgroundColor = 'lightgreen';
                    } else {
                        resultElement.value = 'LOSING';
                        resultElement.style.backgroundColor = 'lightcoral';
                    }
                }
            }
        );
    });
});
