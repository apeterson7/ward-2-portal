//Cred to Burak Kanber for this code 
//https://burakkanber.com/blog/machine-learning-k-means-clustering-in-javascript-part-1/

var data = []

var means = [];
var assignments = [];
var dataExtremes;
var dataRange;
var k;

export const setUp = (records, partitionNum) => {
	k = partitionNum;
	for(let record of records){
		console.log(record.fields.lat+' '+record.fields.lng);
		data.push([parseFloat(record.fields.lat),parseFloat(record.fields.lng)]);
	}
	run();
	var i;
	for(i = 0; i < records.length; i++){
		records[i]["assignment"]=assignments[i];
	}
	console.log(records);
	return records;
}

function run(){
	// console.log(data)
	dataExtremes = getDataExtremes(data);
	// console.log('extrdataExtremes');
	// console.log(dataExtremes);
	dataRange = getDataRanges(dataExtremes);
	// console.log('dataRanges');
	// console.log(dataRange);
	means = initMeans(k);
	// console.log('means');
	// console.log(means);
	makeAssignments();
	let moveCount = 1;
	while(moveMeans()){
		// console.log('moving '+moveCount);
	}
	// console.log(assignments);
}

function getDataExtremes(points) {
	
	var extremes = [];

	for (var i in data)
	{
		var point = data[i];

		for (var dimension in point)
		{
			if ( ! extremes[dimension] )
			{
				extremes[dimension] = {min: 39, max: -78};
			}

			if (point[dimension] < extremes[dimension].min)
			{
				extremes[dimension].min = point[dimension];
			}

			if (point[dimension] > extremes[dimension].max)
			{
				extremes[dimension].max = point[dimension];
			}
		}
	}

	return extremes;
}

//
function getDataRanges(extremes){
	var ranges = [];

	for (var dimension in extremes)
	{
		ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
	}

	return ranges;

}

function initMeans(k) {

	if ( ! k )
	{
		k = 3;
	}

	while (k--)
	{
		var mean = [];

		for (var dimension in dataExtremes)
		{
			mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
		}

		means.push(mean);
	}

	return means;

};


function makeAssignments() {

	for (var i in data)
	{
		var point = data[i];
		var distances = [];

		for (var j in means)
		{
			var mean = means[j];
			var sum = 0;

			for (var dimension in point)
			{
				var difference = point[dimension] - mean[dimension];
				difference *= difference;
				sum += difference;
			}

			distances[j] = Math.sqrt(sum);
		}

		assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
	}
}

function moveMeans() {

    makeAssignments();

    var sums = Array( means.length );
    var counts = Array( means.length );
    var moved = false;

    for (var j in means)
    {
        counts[j] = 0;
        sums[j] = Array( means[j].length );
        for (var dimension in means[j])
        {
            sums[j][dimension] = 0;
        }
    }

    for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        counts[mean_index]++;

        for (var dimension in mean)
        {
            sums[mean_index][dimension] += point[dimension];
        }
    }

    for (var mean_index in sums)
    {
        console.log(counts[mean_index]);
        if ( 0 === counts[mean_index] ) 
        {
            sums[mean_index] = means[mean_index];
            console.log("Mean with no points");
            console.log(sums[mean_index]);

            for (var dimension in dataExtremes)
            {
                sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
            continue;
        }

        for (var dimension in sums[mean_index])
        {
            sums[mean_index][dimension] /= counts[mean_index];
        }
    }

    if (means.toString() !== sums.toString())
    {
        moved = true;
    }

    means = sums;

    return moved;

}