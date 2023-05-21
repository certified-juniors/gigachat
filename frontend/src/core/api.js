import axios from 'axios';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

const URL = 'http://62.217.177.150:8082/';

const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// return string
export async function getHi() {
    const response = await api.get('/hi');
    return response.data;
}

//work with socket
// event instance example
// const event = {
//     header: {
//         type: 'new_message',
//     },
//     body: {
//         date: '2021-05-05T12:00:00',
//         message: 'hello',
//         sender: {
//             name: 'user',
//             surname: 'user',
//             patronymic: 'user',
//             username: 'user',
//             urlAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
//         },
//         receiver: {
//              name: 'user',
//              surname: 'user',
//              patronymic: 'user',
//              username: 'user',
//              urlAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
//          },
//     },
// };
export function connect(callback) {
    const socket = new SockJS(URL + 'ws');
    const stompClient = over(socket);
    stompClient.connect({}, () => callback(stompClient), disconnect.bind(null, stompClient));
    return stompClient;
}

export function disconnect(stompClient) {
    stompClient.disconnect();
}

export function subscribeForEvent(stompClient, callback) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    stompClient.subscribe(`/user/${sessionId}/queue/gigachat`, callback);
}

/**
     * @param user на вход:
     *             String login,
     *             String mail
     * @return status:
     *             user already exists,
     *             mail already exists,
     *             done
     */
export async function createRegistrationCode(login, mail) {
    const response = await api.post('/authorization/registration/createRegistrationCode', {
        login,
        mail,
    });
    return response.data;
}

/**
 * @param mail:
 *            String mail
 */
export async function sendEmailCode(mail) {
    await api.post('/authorization/registration/sendCode', {
        mail,
    });
}

/**
     * @param user на вход:
     *             String login,
     *             String mail
     *             String password
     *             String code;
     * @return status:
     *             denied
     *             done
     */
export async function confirmRegistration(login, mail, password, code) {
    const response = await api.post('/authorization/registration/mailConfirmation', {
        login,
        mail,
        password,
        code,
    });
    return response.data;
}

/**
     * @param user на вход:
     *             String login,
     *             String password
     * @return status:
     *              user does not exist
     *              wrong password
     *              done
     *         sessionId:
     *              String {sessionId}
     */
export async function login(login, password) {
    const response = await api.post('/authorization/login', {
        login,
        password,
    });
    if (response.data.status === 'done') {
        localStorage.setItem('sessionId', response.data.sessionId);
        localStorage.setItem('login', login);
    }
    return response.data;
}

/**
     * @param sessionId на вход:
     *                  String sessionId
     * @return status:
     *                  done
     */
export async function logout() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.post('/authorization/logout', {
        sessionId,
    });
    if (response.data?.status === 'done') {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('login');
    }
    return response.data;
}


export async function checkNickname(nickname) {
    const response = await api.post('/profile/checkNickname/' + nickname);
    if (response.status == 200) {
        return response.data;
    } else {
        return "false";
    }
}



/**
 * @param userData {
 *      DOB: '1999-12-31',
 *      name: 'user',
 *      surname: 'user',
 *      number: '+7(999)999-99-99',
 *      gender: 'male'
 * }
 */
export async function addUserData(userData) {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        await api.post('/profile/addUserData/' + sessionId + "/" + userData.nickname, {
            ...userData
        });
    }
}

/**
 * @param nickname: string
 * @return [
 *      {
 *          id: 1,
 *         name: 'user',
 *        surname: 'user',
 *       urlAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
 *        nickname: 'user',
 * }
 * ]
 * */
export async function findUserByNickname(nickname) {
    const response = await api.post('/find/userByNickname/' + nickname);
    if (response.status == 200) {
        return response.data;
    } else {
        return [];
    }
}


export async function addNewChat(data) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.post('/create/chat/by/' + encodeURI(sessionId), {...data});
    return response.data;
}

/**
     * @param userId - кого пригласить
     * @param chatId - куда пригласить
     * @param session - String sessionId (кто приглашает)
     * @return
     */
export async function invite(userId, chatId) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.post(`/invite/${userId}/toChat/${chatId}`, {
        session: sessionId
    });
    return response.status == 200;
}

export async function getInvites() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.get(`/info/invites/${encodeURI(sessionId)}`);
    if (response.status == 200) {
        return response.data;
    } else {
        return [];
    }
}


export async function accept(chatId) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.post(`/invite/${encodeURI(sessionId)}/accept/${chatId}`)
    return response.status == 200;
}

export async function decline(chatId) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.post(`/invite/${encodeURI(sessionId)}/deny/${chatId}`)
    return response.status == 200;
}

export async function whoAmI() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    const response = await api.get(`/info/user/${encodeURI(sessionId)}`);
    if (response.status == 200) {
        return response.data;
    } else {
        return {};
    }
}