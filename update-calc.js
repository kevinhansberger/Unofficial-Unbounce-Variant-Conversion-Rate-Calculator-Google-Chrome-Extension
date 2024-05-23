document.getElementById('calculate').addEventListener('click', function() {
    // Inject a content script into the active tab to get variant IDs and update input fields
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

                    const pageName = getTextContent('h2[data-testid="page-name"]');
                    const variantIds = Array.from(document.querySelectorAll('div[data-testid*="variant-id-"]'))
                        .map(div => div.getAttribute('data-testid').replace('variant-id-', ''))
                        .slice(0, 5); // Take up to 5 occurrences

                    const data = {
                        pageName,
                        champData: variantIds[0] ? getVisitorConversionData(variantIds[0]) : null,
                        v1Data: variantIds[1] ? getVisitorConversionData(variantIds[1]) : null,
                        v2Data: variantIds[2] ? getVisitorConversionData(variantIds[2]) : null,
                        v3Data: variantIds[3] ? getVisitorConversionData(variantIds[3]) : null,
                        v4Data: variantIds[4] ? getVisitorConversionData(variantIds[4]) : null,
                        variantIds
                    };

                    return data;
                },
            },
            (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;
                    const variantIds = data.variantIds;

                    if (variantIds[0]) document.getElementById('champname').value = variantIds[0];
                    if (variantIds[1]) document.getElementById('v1name').value = variantIds[1];
                    if (variantIds[2]) document.getElementById('v2name').value = variantIds[2];
                    if (variantIds[3]) document.getElementById('v3name').value = variantIds[3];
                    if (variantIds[4]) document.getElementById('v4name').value = variantIds[4];

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
