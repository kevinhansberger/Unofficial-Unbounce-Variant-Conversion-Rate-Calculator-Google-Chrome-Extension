document.getElementById('calculate').addEventListener('click', function() {
    // Retrieve variant names from the input fields
    const champName = document.getElementById('champname').value.toLowerCase();
    const v1Name = document.getElementById('v1name').value.toLowerCase();
    const v2Name = document.getElementById('v2name').value.toLowerCase();
    const v3Name = document.getElementById('v3name').value.toLowerCase();
    const v4Name = document.getElementById('v4name').value.toLowerCase();

    // Inject a content script into the active tab to get the page name, visitors, and conversions for all variants
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                func: (champName, v1Name, v2Name, v3Name, v4Name) => {
                    const getTextContent = (selector) => {
                        const element = document.querySelector(selector);
                        return element ? element.textContent : null;
                    };

                    const getVisitorConversionData = (id) => {
                        const visitors = getTextContent(`span[data-testid="visitors-${id}"]`);
                        const conversions = getTextContent(`span[data-testid="conversion-number-${id}"]`);
                        return { visitors, conversions };
                    };

                    const pageName = getTextContent('h2[data-testid="page-name"]');
                    const champData = getVisitorConversionData(champName);
                    const v1Data = getVisitorConversionData(v1Name);
                    const v2Data = getVisitorConversionData(v2Name);
                    const v3Data = getVisitorConversionData(v3Name);
                    const v4Data = getVisitorConversionData(v4Name);

                    return { pageName, champData, v1Data, v2Data, v3Data, v4Data };
                },
                args: [champName, v1Name, v2Name, v3Name, v4Name],
            },
            (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;
                    document.getElementById('pageName').value = data.pageName;

                    document.getElementById('champcurrentVisitors').value = data.champData.visitors;
                    document.getElementById('champcurrentConversions').value = data.champData.conversions;

                    document.getElementById('v1currentVisitors').value = data.v1Data.visitors;
                    document.getElementById('v1currentConversions').value = data.v1Data.conversions;

                    document.getElementById('v2currentVisitors').value = data.v2Data.visitors;
                    document.getElementById('v2currentConversions').value = data.v2Data.conversions;

                    document.getElementById('v3currentVisitors').value = data.v3Data.visitors;
                    document.getElementById('v3currentConversions').value = data.v3Data.conversions;

                    document.getElementById('v4currentVisitors').value = data.v4Data.visitors;
                    document.getElementById('v4currentConversions').value = data.v4Data.conversions;
                }

                // Proceed with calculations after updating the input fields
                const champCurrentVisitors = parseFloat(document.getElementById('champcurrentVisitors').value);
                const champCurrentConversions = parseFloat(document.getElementById('champcurrentConversions').value);

                for (let i = 1; i <= 4; i++) {
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
                    if (variantCurrentVisitors < 100) {
                        resultElement.value = 'ANALYZING';
                        resultElement.style.backgroundColor = 'yellow';
                    } else if (variantConversionRate > champConversionRate) {
                        resultElement.value = 'WINNER';
                        resultElement.style.backgroundColor = 'lightgreen';
                    } else {
                        resultElement.value = 'LOSER';
                        resultElement.style.backgroundColor = 'lightcoral';
                    }
                }
            }
        );
    });
});

document.querySelector('form').addEventListener('reset', function() {
    document.querySelectorAll('.result').forEach(el => {
        el.value = '';
        el.style.backgroundColor = '';
    });
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
});

function saveFormData() {
    const formData = {};
    document.querySelectorAll('#rateForm input[type="number"], #rateForm input[type="text"]').forEach(input => {
        formData[input.id] = input.value;
    });
    document.querySelectorAll('#rateForm .result').forEach(result => {
        formData[result.id] = {
            value: result.value,
            backgroundColor: result.style.backgroundColor
        };
    });
    chrome.storage.local.set({formData: formData}, () => console.log('Form data saved'));
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('formData', (data) => {
        if (data.formData) {
            Object.keys(data.formData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (typeof data.formData[key] === 'object' && data.formData[key] !== null) {
                        element.value = data.formData[key].value;
                        element.style.backgroundColor = data.formData[key].backgroundColor;
                    } else {
                        element.value = data.formData[key];
                    }
                }
            });
        }
    });

    document.querySelectorAll('#rateForm input').forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});
