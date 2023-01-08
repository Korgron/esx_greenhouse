fx_version 'cerulean'
game { 'gta5' }

author 'Korgron'
description 'esx_greenhouse'

version '1.0.0'

client_script 'build/client.js'
server_script 'build/server.js'

dependencies {
    '/server:5949',
	'/onesync',
    "oxmysql",
    'es_extended'
}