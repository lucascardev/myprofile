const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('Fetching contributions HTML from GitHub...');
    const res = await fetch('https://github.com/users/lucascardev/contributions');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const html = await res.text();
    
    // Parse total contributions
    const totalMatch = html.match(/([0-9,]+)\s+contributions\s+in the last year/i);
    const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : 0;
    console.log(`Parsed total contributions: ${total}`);

    // Parse daily contributions
    const tdRegex = /<td[^>]+class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
    const dateRegex = /data-date="([^"]+)"/;
    const levelRegex = /data-level="([^"]+)"/;
    const idRegex = /id="([^"]+)"/;
    
    const tds = html.match(tdRegex) || [];
    console.log(`Found ${tds.length} calendar day cells.`);
    
    // Parse tooltips to match with cell IDs
    const tooltipRegex = /<tool-tip[^>]+for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
    const tooltips = {};
    let tMatch;
    while ((tMatch = tooltipRegex.exec(html)) !== null) {
      const tdId = tMatch[1];
      const text = tMatch[2].trim();
      
      let count = 0;
      if (text.toLowerCase().startsWith('no ')) {
        count = 0;
      } else {
        const countMatch = text.match(/^([0-9,]+)/);
        if (countMatch) {
          count = parseInt(countMatch[1].replace(/,/g, ''));
        }
      }
      tooltips[tdId] = count;
    }

    const contributions = [];
    tds.forEach(td => {
      const dateM = td.match(dateRegex);
      const levelM = td.match(levelRegex);
      const idM = td.match(idRegex);
      
      if (dateM && levelM && idM) {
        const date = dateM[1];
        const level = parseInt(levelM[1]);
        const id = idM[1];
        const count = tooltips[id] !== undefined ? tooltips[id] : (level > 0 ? 1 : 0);
        
        contributions.push({
          date,
          count,
          level
        });
      }
    });

    // Sort contributions ascending chronologically
    contributions.sort((a, b) => a.date.localeCompare(b.date));

    const result = {
      total,
      contributions
    };

    const targetDir = path.join(__dirname, '..', 'src', 'services');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'contributions.json'), JSON.stringify(result, null, 2));
    console.log('Successfully wrote contributions.json!');
  } catch (error) {
    console.error('Error in fetch-contributions:', error);
    process.exit(1);
  }
}

main();
