"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const request_1 = __importDefault(require("request"));
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("pickmovie")
        .setDescription("Finds a movie based on the genre."),
    async execute(interaction, client) {
        const API_KEY = process.env.API_KEY;
        const genres = [
            { id: '28', name: 'Action' },
            { id: '12', name: 'Adventure' },
            { id: '16', name: 'Animation' },
            { id: '35', name: 'Comedy' },
            { id: '80', name: 'Crime' },
            { id: '99', name: 'Documentary' },
            { id: '18', name: 'Drama' },
            { id: '10751', name: 'Family' },
            { id: '14', name: 'Fantasy' },
            { id: '36', name: 'History' },
            { id: '27', name: 'Horror' },
            { id: '10402', name: 'Music' },
            { id: '9648', name: 'Mystery' },
            { id: '10749', name: 'Romance' },
            { id: '878', name: 'Science Fiction' },
            { id: '10770', name: 'TV Movie' },
            { id: '53', name: 'Thriller' },
            { id: '10752', name: 'War' },
            { id: '37', name: 'Western' }
        ];
        const embed1 = new discord_js_1.EmbedBuilder()
            .setTitle(`Movie Radar`)
            .setColor('#301077')
            .setDescription(`Please select a movie genre down below.`)
            .setThumbnail(client.user?.displayAvatarURL())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp(Date.now());
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('genre')
            .setPlaceholder('Nothing selected')
            .addOptions(genres.map((genre) => {
            return {
                label: genre.name,
                value: genre.id,
            };
        })));
        interaction.reply({ embeds: [embed1], components: [row], ephemeral: true });
        let value = 0;
        client.once(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isStringSelectMenu())
                return;
            if (interaction.customId === 'genre') {
                value = interaction.values[0];
                getMovie(value, async (movie, trailer) => {
                    let image = null;
                    if (movie.backdrop_path == null) {
                        image = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
                    }
                    else {
                        image = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                    }
                    let video = null;
                    if (trailer !== null) {
                        video = `https://www.youtube.com/watch?v=${trailer.key}`;
                    }
                    else {
                        video = "**No trailer was found.**";
                    }
                    let genresArray = [];
                    movie.genre_ids.map((id) => {
                        genres.map((genre) => {
                            if (id == genre.id) {
                                genresArray.push(genre.name);
                            }
                        });
                    });
                    let enteredGenre = null;
                    genres.map((genre) => {
                        if (genre.id == value) {
                            enteredGenre = genre.name;
                        }
                    });
                    const releaseDate = new Date(movie.release_date);
                    const month = releaseDate.getMonth() + 1;
                    const day = releaseDate.getDate();
                    const year = releaseDate.getFullYear();
                    const formattedDate = month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0') + '/' + year;
                    const embed2 = new discord_js_1.EmbedBuilder()
                        .setTitle(`Movie Radar`)
                        .setColor('#301077')
                        .setDescription(`How about watching ` + '`' + movie.title + '`' + ` tonight?`)
                        .addFields({ name: `Genre you entered:`, value: '`' + enteredGenre + '`' })
                        .addFields({ name: `Genres associated with this movie:`, value: '`' + genresArray.join('\n') + '`' })
                        .addFields({ name: `Rating:`, value: '`' + movie.vote_average + '`' })
                        .addFields({ name: `Release Date:`, value: '`' + formattedDate + '`' })
                        .addFields({ name: `Description:`, value: movie.overview })
                        .setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setImage(image)
                        .setTimestamp(Date.now());
                    await interaction.reply({ embeds: [embed2] });
                    await interaction.followUp({ content: `Here is the trailer: ${video}` });
                });
            }
        });
        function getMovie(genre, callback) {
            const page = Math.floor(Math.random() * 500) + 1;
            const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&with_original_language=en&adult=false&page=${page}`;
            (0, request_1.default)(moviesUrl, { json: true }, async (err, res, body) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let movies = [...body.results];
                const movie = movies[Math.floor(Math.random() * movies.length)];
                if (movie === undefined) {
                    await interaction.followUp({ content: `No movies were found.`, ephemeral: true });
                }
                else {
                    const trailersUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`;
                    (0, request_1.default)(trailersUrl, { json: true }, (err, res, body) => {
                        let trailers = [...body.results];
                        let trailer = null;
                        if (trailers.length > 0) {
                            trailer = trailers[0];
                        }
                        callback(movie, trailer);
                    });
                }
            });
        }
    },
};
