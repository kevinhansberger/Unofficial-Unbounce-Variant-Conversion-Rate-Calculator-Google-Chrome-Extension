document.getElementById('calculate').addEventListener('click', function() {
    // Getting input values from the form
    const champCurrentVisitors = parseFloat(document.getElementById('champcurrentVisitors').value);
    const champCurrentConversions = parseFloat(document.getElementById('champcurrentConversions').value);

    // Iterating through each variant (now for three variants)
    for (let i = 1; i <= 3; i++) {
        const variantCurrentVisitorsInput = document.getElementById(`v${i}currentVisitors`);
        const variantCurrentVisitors = parseFloat(variantCurrentVisitorsInput.value);
        if (!variantCurrentVisitors) { // Check if currentViews is empty or zero
            document.getElementById(`v${i}Result`).value = ''; // Keep the result field empty
            continue; // Skip the rest of the loop for this variant
        }
        const variantCurrentConversions = parseFloat(document.getElementById(`v${i}currentConversions`).value);
        const champStartingVisitors = parseFloat(document.getElementById(`champstartingVisitors${i}`).value);
        const champStartingConversions = parseFloat(document.getElementById(`champstartingConversions${i}`).value);

        // Calculate conversion rates for both champ and variant
        const champConversionRate = (champCurrentConversions - champStartingConversions) / (champCurrentVisitors - champStartingVisitors) * 100;
        const variantConversionRate = (variantCurrentConversions / variantCurrentVisitors) * 100;

        // Update the champ conversion rate display, formatted as a percentage to two decimal places
        document.getElementById(`champcurrentconversionRate${i}`).value = `${champConversionRate.toFixed(2)}%`;

        // Update the variant conversion rate display, also formatted as a percentage to two decimal places
        document.getElementById(`v${i}currentconversionRate`).value = `${variantConversionRate.toFixed(2)}%`;

        // Determine and display the result
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
});

document.querySelector('form').addEventListener('reset', function() {
    document.querySelectorAll('.result').forEach(el => {
        el.value = ''; // Clear the result input
        el.style.backgroundColor = ''; // Reset background color
    });
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = ''); // Optionally clear all number and text inputs on reset
});

//
//
//

function saveFormData() {
    const formData = {};
    // Save input values
    document.querySelectorAll('#rateForm input[type="number"], #rateForm input[type="text"]').forEach(input => {
        formData[input.id] = input.value;
    });
    // Save calculated results or other dynamic fields, ensure these fields have IDs or class names that can be selected
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
                        // Assuming it's an object with value and other properties like backgroundColor
                        element.value = data.formData[key].value;
                        element.style.backgroundColor = data.formData[key].backgroundColor;
                    } else {
                        // Normal input fields
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
