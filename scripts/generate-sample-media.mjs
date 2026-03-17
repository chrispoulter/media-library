import { mkdir, rm, utimes, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const testMediaRoot = join(repoRoot, 'test-media');
const moviesRoot = join(testMediaRoot, 'movies');
const tvShowsRoot = join(testMediaRoot, 'tv-shows');

const FILE_BYTES = Buffer.from('sample media placeholder\n', 'utf8');
const START_AT = new Date('2026-03-12T09:00:00Z').getTime();
const STEP_MS = 1000 * 60 * 60 * 6;

const movies = [
    { folder: 'A', file: 'Alien (1979).mkv' },
    { folder: 'A', file: 'Amadeus (1984).mkv' },
    { folder: 'A', file: 'Annihilation (2018).mp4' },
    { folder: 'A', file: 'Arrival (2016).mkv' },
    { folder: 'A', file: 'Apocalypse Now (1979).m4v' },
    { folder: 'A', file: 'A Beautiful Mind (2001).mkv' },
    { folder: 'A', file: 'American History X (1998).mp4' },
    { folder: 'B', file: 'Blade Runner (1982).mkv' },
    { folder: 'B', file: 'Blade Runner 2049 (2017).mkv' },
    { folder: 'B', file: 'Braveheart (1995).mp4' },
    { folder: 'B', file: 'Black Panther (2018).mkv' },
    { folder: 'B', file: 'Brooklyn (2015).m4v' },
    { folder: 'B', file: 'Bohemian Rhapsody (2018).mkv' },
    { folder: 'B', file: 'Before Sunrise (1995).mp4' },
    { folder: 'C', file: 'Chinatown (1974).mkv' },
    { folder: 'C', file: 'Coco (2017).mp4' },
    { folder: 'C', file: 'Crouching Tiger Hidden Dragon (2000).mkv' },
    { folder: 'C', file: 'Cast Away (2000).avi' },
    { folder: 'C', file: 'Children of Men (2006).mkv' },
    { folder: 'C', file: 'Catch Me If You Can (2002).mp4' },
    { folder: 'D', file: 'Drive (2011).mkv' },
    { folder: 'D', file: 'Dune (2021).mkv' },
    { folder: 'D', file: 'Dune - Part Two (2024).mkv' },
    { folder: 'D', file: 'Django Unchained (2012).mp4' },
    { folder: 'D', file: 'Die Hard (1988).avi' },
    { folder: 'D', file: 'Dunkirk (2017).mkv' },
    { folder: 'D', file: 'District 9 (2009).mp4' },
    { folder: 'E', file: 'Everything Everywhere All at Once (2022).webm' },
    { folder: 'E', file: 'Ex Machina (2014).mkv' },
    { folder: 'E', file: 'Eternal Sunshine of the Spotless Mind (2004).mkv' },
    { folder: 'E', file: 'Edge of Tomorrow (2014).mp4' },
    { folder: 'F', file: 'Fight Club (1999).mkv' },
    { folder: 'F', file: 'Forrest Gump (1994).mp4' },
    { folder: 'F', file: 'Fargo (1996).mkv' },
    { folder: 'F', file: 'Ford v Ferrari (2019).mkv' },
    { folder: 'F', file: 'Full Metal Jacket (1987).avi' },
    { folder: 'G', file: 'Gladiator (2000).mkv' },
    { folder: 'G', file: 'Get Out (2017).mp4' },
    { folder: 'G', file: 'Good Will Hunting (1997).mkv' },
    { folder: 'G', file: 'Gran Torino (2008).m4v' },
    { folder: 'G', file: 'Gravity (2013).mkv' },
    { folder: 'H', file: 'Heat (1995).mkv' },
    { folder: 'H', file: 'Her (2013).mp4' },
    { folder: 'H', file: 'Hidden Figures (2016).mkv' },
    { folder: 'H', file: 'How to Train Your Dragon (2010).mp4' },
    { folder: 'I', file: 'Inception (2010).mkv' },
    { folder: 'I', file: 'Interstellar (2014).mkv' },
    { folder: 'I', file: 'Inside Out (2015).mp4' },
    { folder: 'I', file: 'In the Mood for Love (2000).mkv' },
    { folder: 'J', file: 'Joker (2019).mkv' },
    { folder: 'J', file: 'Jurassic Park (1993).mp4' },
    { folder: 'J', file: 'John Wick (2014).mkv' },
    { folder: 'J', file: 'Jojo Rabbit (2019).m4v' },
    { folder: 'K', file: 'Kill Bill - Volume 1 (2003).mkv' },
    { folder: 'K', file: 'Kill Bill - Volume 2 (2004).mkv' },
    { folder: 'K', file: 'Knives Out (2019).mp4' },
    { folder: 'L', file: 'La La Land (2016).mkv' },
    { folder: 'L', file: 'Lawrence of Arabia (1962).mkv' },
    { folder: 'L', file: 'Leon - The Professional (1994).mp4' },
    { folder: 'L', file: 'Little Women (2019).mkv' },
    { folder: 'L', file: 'Logan (2017).m4v' },
    { folder: 'M', file: 'Mad Max - Fury Road (2015).mp4' },
    { folder: 'M', file: 'Memento (2000).mkv' },
    { folder: 'M', file: 'Moonlight (2016).mkv' },
    { folder: 'M', file: 'Marriage Story (2019).mp4' },
    { folder: 'M', file: 'Midsommar (2019).mkv' },
    { folder: 'M', file: 'Minority Report (2002).avi' },
    { folder: 'M', file: 'Mulholland Drive (2001).mkv' },
    { folder: 'M', file: 'Not a video file.txt' },
    { folder: 'N', file: 'No Country for Old Men (2007).mkv' },
    { folder: 'N', file: 'Nightcrawler (2014).mp4' },
    { folder: 'N', file: 'Nomadland (2020).mkv' },
    { folder: 'O', file: 'Oldboy (2003).mkv' },
    { folder: 'O', file: 'Oppenheimer (2023).mkv' },
    { folder: 'O', file: 'Once Upon a Time in Hollywood (2019).mp4' },
    { folder: 'P', file: 'Parasite (2019).mkv' },
    { folder: 'P', file: "Pan's Labyrinth (2006).mkv" },
    { folder: 'P', file: 'Prisoners (2013).mp4' },
    { folder: 'P', file: 'Poor Things (2023).mkv' },
    { folder: 'P', file: 'Pulp Fiction (1994).mkv' },
    { folder: 'P', file: 'Pride and Prejudice (2005).m4v' },
    { folder: 'R', file: 'Requiem for a Dream (2000).mkv' },
    { folder: 'R', file: 'Roma (2018).mkv' },
    { folder: 'R', file: 'Rush (2013).mp4' },
    { folder: 'R', file: 'Ratatouille (2007).mp4' },
    { folder: 'R', file: 'Ready Player One (2018).mkv' },
    { folder: 'S', file: "Schindler's List (1993).mkv" },
    { folder: 'S', file: 'Shutter Island (2010).mkv' },
    { folder: 'S', file: 'Silence of the Lambs (1991).mp4' },
    { folder: 'S', file: 'Spotlight (2015).mkv' },
    { folder: 'S', file: 'Spider-Man - Into the Spider-Verse (2018).m4v' },
    { folder: 'S', file: 'Snowpiercer (2013).mkv' },
    { folder: 'S', file: 'Succession (2018).mp4' },
    { folder: 'S', file: 'Soul (2020).mp4' },
    { folder: 'S', file: 'Spirited Away (2001).mkv' },
    { folder: 'S', file: 'Stand by Me (1986).avi' },
    { folder: 'T', file: 'The Matrix (1999).mkv' },
    { folder: 'T', file: 'The Shawshank Redemption (1994).mkv' },
    { folder: 'T', file: 'The Godfather (1972).mkv' },
    { folder: 'T', file: 'The Dark Knight (2008).mkv' },
    { folder: 'T', file: 'The Departed (2006).mp4' },
    { folder: 'T', file: 'The Grand Budapest Hotel (2014).m4v' },
    { folder: 'T', file: 'The Revenant (2015).mkv' },
    { folder: 'T', file: 'The Social Network (2010).mp4' },
    { folder: 'T', file: 'The Shape of Water (2017).mkv' },
    { folder: 'T', file: 'The Truman Show (1998).mkv' },
    { folder: 'T', file: 'The Witch (2015).mp4' },
    { folder: 'T', file: 'The Zone of Interest (2023).mkv' },
    { folder: 'T', file: 'The Unknown Movie (1999).mkv' },
    {
        folder: 'T',
        file: 'Three Billboards Outside Ebbing Missouri (2017).mkv',
    },
    { folder: 'T', file: 'Tenet (2020).mkv' },
    { folder: 'T', file: 'Toy Story (1995).mp4' },
    { folder: 'U', file: 'Uncut Gems (2019).mkv' },
    { folder: 'U', file: 'Up (2009).mp4' },
    { folder: 'V', file: 'V for Vendetta (2005).mkv' },
    { folder: 'V', file: 'Vertigo (1958).mkv' },
    { folder: 'W', file: 'Wall-E (2008).mp4' },
    { folder: 'W', file: 'Whiplash (2014).mkv' },
    { folder: 'W', file: 'Wind River (2017).mkv' },
    { folder: 'W', file: 'Wonder Woman (2017).mp4' },
    { folder: 'W', file: 'Wolfwalkers (2020).mkv' },
    { folder: 'X', file: 'X (2022).mkv' },
    { folder: 'Y', file: 'Yi Yi (2000).mkv' },
    { folder: 'Z', file: 'Zootopia (2016).mp4' },
    { folder: 'Z', file: 'Zero Dark Thirty (2012).mkv' },
    // More A entries
    { folder: 'A', file: 'About Time (2013).mkv' },
    { folder: 'A', file: 'Argo (2012).mp4' },
    { folder: 'A', file: 'Ad Astra (2019).mkv' },
    { folder: 'A', file: 'Almost Famous (2000).m4v' },
    // More B entries
    { folder: 'B', file: 'Big Fish (2003).mkv' },
    { folder: 'B', file: 'Barbie (2023).mp4' },
    { folder: 'B', file: 'Burning (2018).mkv' },
    { folder: 'B', file: 'Blue Valentine (2010).mkv' },
    // More C entries
    { folder: 'C', file: 'Carol (2015).mkv' },
    { folder: 'C', file: 'Cold War (2018).mp4' },
    { folder: 'C', file: 'Cloud Atlas (2012).mkv' },
    // More D entries
    { folder: 'D', file: 'Darkest Hour (2017).mkv' },
    { folder: 'D', file: 'Dancer in the Dark (2000).mkv' },
    // More E entries
    { folder: 'E', file: 'Enemy (2013).mkv' },
    { folder: 'E', file: 'Eyes Wide Shut (1999).mp4' },
    // More F entries
    { folder: 'F', file: 'First Man (2018).mkv' },
    { folder: 'F', file: 'Face-Off (1997).avi' },
    // More G entries
    { folder: 'G', file: 'Gone Girl (2014).mkv' },
    { folder: 'G', file: 'Ghost in the Shell (1995).mkv' },
    // More H entries
    { folder: 'H', file: 'Hereditary (2018).mkv' },
    { folder: 'H', file: 'Hacksaw Ridge (2016).mp4' },
    // More I entries
    { folder: 'I', file: 'I, Tonya (2017).mkv' },
    { folder: 'I', file: 'Into the Wild (2007).mp4' },
    // More J entries
    { folder: 'J', file: 'Jackie (2016).mkv' },
    { folder: 'J', file: 'Jaws (1975).mp4' },
    // More K entries
    { folder: 'K', file: 'Kingdom of Heaven (2005).mkv' },
    // More L entries
    { folder: 'L', file: 'Lost in Translation (2003).mkv' },
    { folder: 'L', file: 'Life of Pi (2012).mp4' },
    // More M entries
    { folder: 'M', file: 'Moonrise Kingdom (2012).mkv' },
    { folder: 'M', file: 'Magnolia (1999).mkv' },
    // More N entries
    { folder: 'N', file: 'Never Let Me Go (2010).mkv' },
    // More O entries
    { folder: 'O', file: 'Okja (2017).mkv' },
    // More P entries
    { folder: 'P', file: 'Portrait of a Lady on Fire (2019).mkv' },
    { folder: 'P', file: 'Phantom Thread (2017).mp4' },
    // More R entries
    { folder: 'R', file: "Rosemary's Baby (1968).mkv" },
    // More S entries
    { folder: 'S', file: 'Suspiria (2018).mkv' },
    { folder: 'S', file: 'Se7en (1995).mkv' },
    { folder: 'S', file: 'Silver Linings Playbook (2012).mp4' },
    // More T entries
    { folder: 'T', file: 'There Will Be Blood (2007).mkv' },
    { folder: 'T', file: 'Top Gun - Maverick (2022).mp4' },
    { folder: 'T', file: 'Tick Tick Boom (2021).mkv' },
    // More U entries
    { folder: 'U', file: 'Us (2019).mkv' },
    // More W entries
    { folder: 'W', file: 'When Harry Met Sally (1989).mkv' },
    { folder: 'W', file: 'War Horse (2011).mp4' },
    // Extra placeholder
    { folder: 'M', file: 'metadata-file.nfo' },
];

const generateEpisodes = (title, seasons, ext = 'mkv') =>
    seasons.flatMap((count, si) =>
        Array.from(
            { length: count },
            (_, ei) =>
                `${title} S${String(si + 1).padStart(2, '0')}E${String(ei + 1).padStart(2, '0')}.${ext}`
        )
    );

const tvShows = [
    {
        folder: 'Abbott Elementary',
        episodes: generateEpisodes('Abbott Elementary', [6, 8, 8], 'mp4'),
    },
    { folder: 'Andor', episodes: generateEpisodes('Andor', [12, 12], 'mkv') },
    {
        folder: 'Arrested Development',
        episodes: generateEpisodes('Arrested Development', [22, 18, 13], 'mp4'),
    },
    {
        folder: 'Atlanta',
        episodes: generateEpisodes('Atlanta', [10, 11, 10, 10], 'mkv'),
    },
    {
        folder: 'Band of Brothers',
        episodes: generateEpisodes('Band of Brothers', [10], 'mkv'),
    },
    {
        folder: 'Barry',
        episodes: generateEpisodes('Barry', [8, 8, 6, 8], 'mkv'),
    },
    {
        folder: 'Better Call Saul',
        episodes: generateEpisodes(
            'Better Call Saul',
            [10, 10, 10, 10, 10, 13],
            'mkv'
        ),
    },
    {
        folder: 'Black Mirror',
        episodes: generateEpisodes('Black Mirror', [3, 3, 6, 6, 5, 5], 'mp4'),
    },
    {
        folder: 'Bojack Horseman',
        episodes: generateEpisodes(
            'Bojack Horseman',
            [12, 13, 12, 12, 13, 16],
            'mkv'
        ),
    },
    {
        folder: 'Breaking Bad',
        episodes: generateEpisodes('Breaking Bad', [7, 13, 13, 13, 16], 'mkv'),
    },
    {
        folder: 'Broadchurch',
        episodes: generateEpisodes('Broadchurch', [8, 8, 8], 'mkv'),
    },
    {
        folder: 'Chernobyl',
        episodes: generateEpisodes('Chernobyl', [5], 'mkv'),
    },
    {
        folder: 'Cobra Kai',
        episodes: generateEpisodes('Cobra Kai', [10, 10, 10, 10, 10], 'mp4'),
    },
    { folder: 'Dark', episodes: generateEpisodes('Dark', [10, 8, 8], 'mkv') },
    {
        folder: 'Dark Matter',
        episodes: generateEpisodes('Dark Matter', [9], 'mkv'),
    },
    {
        folder: 'Derry Girls',
        episodes: generateEpisodes('Derry Girls', [6, 6, 7], 'mp4'),
    },
    {
        folder: 'Euphoria',
        episodes: generateEpisodes('Euphoria', [8, 8], 'mkv'),
    },
    { folder: 'Fleabag', episodes: generateEpisodes('Fleabag', [6, 6], 'mkv') },
    {
        folder: 'For All Mankind',
        episodes: generateEpisodes('For All Mankind', [10, 10, 10, 10], 'mkv'),
    },
    {
        folder: 'Fargo',
        episodes: generateEpisodes('Fargo', [10, 10, 10, 11, 12], 'mkv'),
    },
    {
        folder: 'Game of Thrones',
        episodes: generateEpisodes(
            'Game of Thrones',
            [10, 10, 10, 10, 10, 10, 7, 6],
            'mkv'
        ),
    },
    {
        folder: 'Ghosts',
        episodes: generateEpisodes('Ghosts', [8, 9, 10, 10, 10], 'mp4'),
    },
    {
        folder: 'Girls',
        episodes: generateEpisodes('Girls', [10, 11, 12, 12, 10, 10], 'mkv'),
    },
    {
        folder: 'Halt and Catch Fire',
        episodes: generateEpisodes(
            'Halt and Catch Fire',
            [10, 10, 10, 10],
            'mkv'
        ),
    },
    {
        folder: 'Hannibal',
        episodes: generateEpisodes('Hannibal', [13, 13, 13], 'mkv'),
    },
    {
        folder: 'House of Cards',
        episodes: generateEpisodes(
            'House of Cards',
            [13, 13, 13, 13, 13, 13],
            'mp4'
        ),
    },
    {
        folder: 'House of the Dragon',
        episodes: generateEpisodes('House of the Dragon', [10, 8], 'mkv'),
    },
    {
        folder: 'I May Destroy You',
        episodes: generateEpisodes('I May Destroy You', [12], 'mkv'),
    },
    {
        folder: 'Industry',
        episodes: generateEpisodes('Industry', [8, 8, 8], 'mkv'),
    },
    {
        folder: "It's Always Sunny in Philadelphia",
        episodes: generateEpisodes(
            "It's Always Sunny in Philadelphia",
            [7, 10, 15, 13, 10, 10, 10, 10, 10, 10],
            'mp4'
        ),
    },
    {
        folder: 'Justified',
        episodes: generateEpisodes(
            'Justified',
            [13, 13, 13, 13, 13, 13],
            'mkv'
        ),
    },
    {
        folder: 'Killing Eve',
        episodes: generateEpisodes('Killing Eve', [8, 8, 8, 8], 'mkv'),
    },
    { folder: 'Loki', episodes: generateEpisodes('Loki', [6, 6], 'mkv') },
    {
        folder: 'Lost',
        episodes: generateEpisodes('Lost', [25, 24, 23, 14, 17, 18], 'mkv'),
    },
    {
        folder: 'Mad Men',
        episodes: generateEpisodes(
            'Mad Men',
            [13, 13, 13, 13, 13, 13, 14],
            'mkv'
        ),
    },
    {
        folder: 'Mare of Easttown',
        episodes: generateEpisodes('Mare of Easttown', [7], 'mkv'),
    },
    {
        folder: 'Mindhunter',
        episodes: generateEpisodes('Mindhunter', [10, 9], 'mkv'),
    },
    {
        folder: 'Mr Robot',
        episodes: generateEpisodes('Mr Robot', [10, 12, 10, 13], 'mkv'),
    },
    {
        folder: 'Narcos',
        episodes: generateEpisodes('Narcos', [10, 10, 10], 'mp4'),
    },
    {
        folder: 'Normal People',
        episodes: generateEpisodes('Normal People', [12], 'mkv'),
    },
    {
        folder: 'Only Murders in the Building',
        episodes: generateEpisodes(
            'Only Murders in the Building',
            [10, 10, 10],
            'mp4'
        ),
    },
    {
        folder: 'Oz',
        episodes: generateEpisodes('Oz', [8, 8, 8, 16, 8, 8], 'avi'),
    },
    {
        folder: 'Peaky Blinders',
        episodes: generateEpisodes('Peaky Blinders', [6, 6, 6, 6, 6, 6], 'mkv'),
    },
    {
        folder: 'Person of Interest',
        episodes: generateEpisodes(
            'Person of Interest',
            [23, 22, 23, 22, 13],
            'mp4'
        ),
    },
    { folder: 'Pose', episodes: generateEpisodes('Pose', [8, 10, 7], 'mkv') },
    {
        folder: 'Reservation Dogs',
        episodes: generateEpisodes('Reservation Dogs', [8, 8, 8], 'mkv'),
    },
    { folder: 'Rome', episodes: generateEpisodes('Rome', [12, 10], 'mkv') },
    {
        folder: 'Russian Doll',
        episodes: generateEpisodes('Russian Doll', [8, 8], 'mkv'),
    },
    {
        folder: "Schitt's Creek",
        episodes: generateEpisodes(
            "Schitt's Creek",
            [10, 13, 13, 13, 14, 14],
            'mp4'
        ),
    },
    { folder: 'Sense8', episodes: generateEpisodes('Sense8', [12, 11], 'mkv') },
    {
        folder: 'Severance',
        episodes: generateEpisodes('Severance', [9, 10], 'mkv'),
    },
    {
        folder: 'Sharp Objects',
        episodes: generateEpisodes('Sharp Objects', [8], 'mkv'),
    },
    { folder: 'Shogun', episodes: generateEpisodes('Shogun', [10], 'mkv') },
    {
        folder: 'Silicon Valley',
        episodes: generateEpisodes(
            'Silicon Valley',
            [8, 10, 10, 10, 10, 7],
            'mp4'
        ),
    },
    {
        folder: 'Six Feet Under',
        episodes: generateEpisodes(
            'Six Feet Under',
            [13, 13, 13, 12, 12],
            'mkv'
        ),
    },
    {
        folder: 'Slow Horses',
        episodes: generateEpisodes('Slow Horses', [6, 6, 6, 6], 'mkv'),
    },
    {
        folder: 'Sopranos',
        episodes: generateEpisodes('Sopranos', [13, 13, 13, 13, 13, 21], 'mkv'),
    },
    {
        folder: 'Station Eleven',
        episodes: generateEpisodes('Station Eleven', [10], 'mkv'),
    },
    {
        folder: 'Stranger Things',
        episodes: generateEpisodes('Stranger Things', [8, 9, 8, 9], 'mkv'),
    },
    {
        folder: 'Succession',
        episodes: generateEpisodes('Succession', [10, 10, 9, 10], 'mkv'),
    },
    {
        folder: 'Ted Lasso',
        episodes: generateEpisodes('Ted Lasso', [10, 12, 12], 'mp4'),
    },
    {
        folder: 'The Americans',
        episodes: generateEpisodes(
            'The Americans',
            [13, 13, 13, 13, 13, 10],
            'mkv'
        ),
    },
    {
        folder: 'The Bear',
        episodes: generateEpisodes('The Bear', [8, 10, 6], 'm4v'),
    },
    {
        folder: 'The Crown',
        episodes: generateEpisodes(
            'The Crown',
            [10, 10, 10, 10, 10, 10],
            'mkv'
        ),
    },
    {
        folder: 'The Expanse',
        episodes: generateEpisodes(
            'The Expanse',
            [10, 13, 13, 13, 10, 6],
            'mkv'
        ),
    },
    {
        folder: "The Handmaid's Tale",
        episodes: generateEpisodes(
            "The Handmaid's Tale",
            [10, 13, 13, 10, 10, 10],
            'mkv'
        ),
    },
    {
        folder: 'The Last of Us',
        episodes: generateEpisodes('The Last of Us', [9, 7], 'mkv'),
    },
    {
        folder: 'The Leftovers',
        episodes: generateEpisodes('The Leftovers', [10, 10, 8], 'mkv'),
    },
    {
        folder: 'The Office',
        episodes: generateEpisodes(
            'The Office',
            [6, 22, 23, 19, 28, 26, 26, 24, 25],
            'mp4'
        ),
    },
    {
        folder: 'The Rings of Power',
        episodes: generateEpisodes('The Rings of Power', [8, 8], 'mkv'),
    },
    {
        folder: 'The Terror',
        episodes: generateEpisodes('The Terror', [10, 8], 'mkv'),
    },
    {
        folder: 'The White Lotus',
        episodes: generateEpisodes('The White Lotus', [6, 7, 8], 'mkv'),
    },
    {
        folder: 'The Wire',
        episodes: generateEpisodes('The Wire', [13, 13, 12, 13, 10], 'mkv'),
    },
    {
        folder: 'Tokyo Vice',
        episodes: generateEpisodes('Tokyo Vice', [8, 10], 'mkv'),
    },
    {
        folder: 'True Detective',
        episodes: generateEpisodes('True Detective', [8, 8, 8, 6], 'mkv'),
    },
    {
        folder: 'Twin Peaks',
        episodes: generateEpisodes('Twin Peaks', [8, 22, 18], 'mkv'),
    },
    { folder: 'Undone', episodes: generateEpisodes('Undone', [8, 8], 'mkv') },
    {
        folder: 'Veep',
        episodes: generateEpisodes('Veep', [8, 10, 10, 10, 10, 10, 7], 'mp4'),
    },
    { folder: 'Watchmen', episodes: generateEpisodes('Watchmen', [9], 'mkv') },
    {
        folder: 'Westworld',
        episodes: generateEpisodes('Westworld', [10, 10, 8, 8], 'mkv'),
    },
    {
        folder: 'White Collar',
        episodes: generateEpisodes(
            'White Collar',
            [14, 16, 16, 16, 13, 6],
            'mp4'
        ),
    },
    {
        folder: 'Years and Years',
        episodes: generateEpisodes('Years and Years', [6], 'mkv'),
    },
    {
        folder: 'You',
        episodes: generateEpisodes('You', [10, 10, 10, 10], 'mkv'),
    },
    {
        folder: 'Yellowjackets',
        episodes: generateEpisodes('Yellowjackets', [10, 9, 8], 'mkv'),
    },
    { folder: 'Zen', episodes: generateEpisodes('Zen', [3, 3], 'm4v') },
    {
        folder: 'Justified - City Primeval',
        episodes: generateEpisodes('Justified - City Primeval', [8], 'mkv'),
    },
    {
        folder: 'Interview with the Vampire',
        episodes: generateEpisodes('Interview with the Vampire', [7, 8], 'mkv'),
    },
    { folder: 'From', episodes: generateEpisodes('From', [10, 10, 10], 'mkv') },
    {
        folder: 'Deadwood',
        episodes: generateEpisodes('Deadwood', [12, 12, 12], 'mkv'),
    },
    {
        folder: 'Carnivale',
        episodes: generateEpisodes('Carnivale', [12, 12], 'mkv'),
    },
    {
        folder: 'Battlestar Galactica',
        episodes: generateEpisodes(
            'Battlestar Galactica',
            [13, 20, 20, 22],
            'mkv'
        ),
    },
    {
        folder: 'Ash vs Evil Dead',
        episodes: generateEpisodes('Ash vs Evil Dead', [10, 10, 10], 'mp4'),
    },
    {
        folder: 'Angel',
        episodes: generateEpisodes('Angel', [22, 22, 22, 22, 22], 'avi'),
    },
    {
        folder: 'Alias',
        episodes: generateEpisodes('Alias', [22, 22, 22, 22, 17], 'avi'),
    },
    {
        folder: 'Damages',
        episodes: generateEpisodes('Damages', [13, 13, 13, 13, 10], 'mkv'),
    },
];

const setTimestamp = async (filePath, index) => {
    const timestamp = new Date(START_AT - index * STEP_MS);
    await utimes(filePath, timestamp, timestamp);
};

const createPlaceholderFile = async (filePath, index) => {
    await writeFile(filePath, FILE_BYTES);
    await setTimestamp(filePath, index);
};

const generate = async () => {
    await rm(testMediaRoot, { recursive: true, force: true });
    await mkdir(moviesRoot, { recursive: true });
    await mkdir(tvShowsRoot, { recursive: true });

    let fileIndex = 0;

    for (const movie of movies) {
        const folderPath = join(moviesRoot, movie.folder);
        const filePath = join(folderPath, movie.file);

        await mkdir(folderPath, { recursive: true });
        await createPlaceholderFile(filePath, fileIndex);
        fileIndex += 1;
    }

    for (const show of tvShows) {
        const folderPath = join(tvShowsRoot, show.folder);
        await mkdir(folderPath, { recursive: true });

        for (const episode of show.episodes) {
            const filePath = join(folderPath, episode);
            await createPlaceholderFile(filePath, fileIndex);
            fileIndex += 1;
        }
    }

    const movieCount = movies.filter(
        (m) => !m.file.endsWith('.txt') && !m.file.endsWith('.nfo')
    ).length;
    console.log(`Sample media library created at ${testMediaRoot}`);
    console.log(
        `Movies directory: ${moviesRoot} (${movieCount} video files, ${movies.length - movieCount} non-video)`
    );
    console.log(`TV shows directory: ${tvShowsRoot} (${tvShows.length} shows)`);
    console.log(
        `Created ${fileIndex} placeholder media files with staggered modified times.`
    );
};

generate().catch((error) => {
    console.error('Failed to generate sample media library:', error);
    process.exitCode = 1;
});
