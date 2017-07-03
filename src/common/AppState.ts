export interface Training {
    id: number;
    date_start: number;
    date_end: number | null;
    location_name: string;
    address: string | null;
    description: string | null;
    start_lat: number | null;
    start_lon: number | null;
    first_start_time: string | null;
    last_start_time: string | null;
    parking_lat: number | null;
    parking_lon: number | null;
    parking_info: string | null;
    organiser_name: string | null;
    organiser_email: string | null;
    organiser_phone: string | null;
    club: string | null;
    juniors: number | null;
    cost_adult: number | null;
    cost_junior: number | null;
    other_info: string | null;
}

interface AppState {
    trainings: Training[];
    currentTraining: number;
}

export function CreateDefaultTraining() : Training {
    return {
        id: 0,
        date_start: ((new Date().getTime())/1000),
        date_end: null,
        location_name: "TBC",
        address: null,
        description: null,
        start_lat: null,
        start_lon: null,
        first_start_time: null,
        last_start_time: null,
        parking_lat: null,
        parking_lon: null,
        parking_info: null,
        organiser_name: null,
        organiser_email: null,
        organiser_phone: null,
        club: null,
        juniors: null,
        cost_adult: null,
        cost_junior: null,
        other_info: null
    }
}


export default AppState