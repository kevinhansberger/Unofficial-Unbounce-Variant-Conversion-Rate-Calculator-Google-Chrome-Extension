// Show or hide champ data based on the checkbox state
const checkbox = document.querySelector('.switch input');
const champDataElements = [
    'champdata1', 'champdata2', 'champstartingVisitors1', 'champstartingVisitors2', 'champstartingVisitors3', 'champstartingVisitors4', 'champstartingVisitors5', 'champstartingVisitors6', 'champstartingVisitors7', 'champstartingVisitors8', 'champstartingVisitors9', 'champstartingVisitors10',
    'champstartingConversions1', 'champstartingConversions2', 'champstartingConversions3', 'champstartingConversions4', 'champstartingConversions5', 'champstartingConversions6', 'champstartingConversions7', 'champstartingConversions8', 'champstartingConversions9', 'champstartingConversions10'
];

const toggleChampDataVisibility = () => {
    const displayStyle = checkbox.checked ? '' : 'none';
    champDataElements.forEach(id => {
        document.getElementById(id).style.display = displayStyle;
    });
};

checkbox.addEventListener('change', toggleChampDataVisibility);
toggleChampDataVisibility(); // Initial toggle based on the current checkbox state
