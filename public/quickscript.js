function formatdoc(){
            // Read the JSON file
    const fs = require('fs');

    // Read the current file
    const data = JSON.parse(fs.readFileSync('formatted_quran_dataset.json', 'utf8'));

    // Function to format reference by removing leading zeros
    function formatReference(ref) {
        const [surah, verse] = ref.split(':');
        return `${parseInt(surah)}:${parseInt(verse)}`;
    }

    // Update all references
    data.forEach(item  => {
        item.reference = formatReference(item.reference);
    });

    // Write back to file
    fs.writeFileSync('formatted_quran_dataset.json', JSON.stringify(data, null, 4));

    console.log('References formatted successfully!');
}

function removeSymbolsAndHarakat(data) {
    // Define common symbols that might appear in Quranic text
    const symbolsToRemove = [
        '۞', // Rub el Hizb
        '﴾', '﴿', // Quranic brackets
        '۩', // Sajdah symbol
        '۝', // End of verse symbol (alternative)
        '؁', '؂', '؃', '؄', '؅', '؆', '؇', '؈', '؉', '؊', '؋', ' ', // Various Arabic symbols
        '﷽', // Bismillah symbol
        '۔', // Arabic full stop
        '؎', '؏', // Other punctuation marks
        // Add any other symbols you want to remove
    ];
    
    // Create regex pattern for symbols
    const symbolPattern = new RegExp(`[${symbolsToRemove.join('')}]`, 'g');
    
    // Process each surah
    data.forEach(surah => {
        if (surah.verses) {
            surah.verses.forEach(verse => {
                if (verse.verse && verse.tashkeel) {
                    const originalVerse = verse.verse;
                    const originalTashkeel = [...verse.tashkeel]; // Create a copy
                    
                    let newVerse = '';
                    let newTashkeel = [];
                    let originalIndex = 0;
                    
                    // Process each character in the original verse
                    for (let i = 0; i < originalVerse.length; i++) {
                        const char = originalVerse[i];
                        
                        // Check if current character is a symbol to remove
                        if (!symbolsToRemove.includes(char)) {
                            // Keep this character
                            newVerse += char;
                            
                            // Keep corresponding tashkeel if it exists
                            if (originalIndex < originalTashkeel.length) {
                                newTashkeel.push(originalTashkeel[originalIndex]);
                            }
                        }
                        // If it's a symbol, skip both the character and its tashkeel
                        
                        originalIndex++;
                    }
                    
                    // Update the verse and tashkeel
                    verse.verse = newVerse;
                    verse.tashkeel = newTashkeel;
                    
                    // Optional: Log changes for debugging
                    if (originalVerse !== newVerse) {
                        console.log(`Surah ${surah.surah_number}, Verse ${verse.verse_number}:`);
                        console.log(`Original: ${originalVerse}`);
                        console.log(`Cleaned:  ${newVerse}`);
                        console.log(`Tashkeel length: ${originalTashkeel.length} → ${newTashkeel.length}`);
                        console.log('---');
                    }
                }
            });
        }
    });
    
    return data;
}

function cleanAllSpaces(data) {
    let changesCount = 0;
    
    data.forEach((item, index) => {
        if (item.text && item.tashkeel) {
            const originalText = item.text;
            const originalTashkeel = [...item.tashkeel];
            
            // Count leading spaces
            let leadingSpaces = 0;
            for (let i = 0; i < originalText.length; i++) {
                if (originalText[i] === ' ') {
                    leadingSpaces++;
                } else {
                    break;
                }
            }
            
            // Count trailing spaces
            let trailingSpaces = 0;
            for (let i = originalText.length - 1; i >= 0; i--) {
                if (originalText[i] === ' ') {
                    trailingSpaces++;
                } else {
                    break;
                }
            }
            
            if (leadingSpaces > 0 || trailingSpaces > 0) {
                // Remove leading and trailing spaces from text
                const cleanedText = originalText.slice(leadingSpaces, originalText.length - trailingSpaces);
                
                // Remove corresponding harakat
                const cleanedTashkeel = originalTashkeel.slice(leadingSpaces, originalTashkeel.length - trailingSpaces);
                
                // Update the item
                item.text = cleanedText;
                item.tashkeel = cleanedTashkeel;
                
                changesCount++;
            }
        }
    });
    
    console.log(`\nTotal changes made: ${changesCount}`);
    return data;
}

// Usage script for your file
function cleanQuranDataset() {
    const fs = require('fs');
    const filename = 'formatted_quran_dataset.json';
    // Read the current file
    console.log('Reading formatted_quran_dataset.json...');
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    console.log(`Processing ${data.length} items...`);
    
    // Clean the data
    const cleanedData = cleanAllSpaces(data)
    
    // Write back to file
    fs.writeFileSync(filename, JSON.stringify(cleanedData, null, 4));
    
    console.log('File updated successfully!');
}

// Run the cleaning
cleanQuranDataset();