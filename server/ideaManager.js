import { EVENTS } from "../public/js/constants.js";

export default class IdeaManager {
  constructor(io) {
    /**@type {Map<Number, Message>} */
    this.ideas = new Map();
    this.io = io;

    this.ideas.set(0.283775612578277, {
      title: "Ein Brunnen für den Mathildenplatz",
      text: `Wir wollen den Mathildenplatz attraktiver und zu einem Ort der Erholung und Entspannung zu machen. Er sorgt für 
      eine angenehme Atmosphäre und kann zu einem neuen Treffpunkt werden. Das plätschernde Wasser hat eine beruhigende Wirkung und kann Stress abbauen. Darüber hinaus zieht ein Brunnen oft auch Vögel und andere Tiere an, was dem Platz zusätzlichen Charme verleiht. `,
      author: "Stadt",
      time: 1676134963354,
      votes: { likes: 0, dislikes: 0 },
      id: 0.283775612578277,
      tags: [],
      comments: [],
      markerPoint: { lat: 49.874881, lng: 8.650426 },
      status: "active",
      projectId: 3,
    });
    this.ideas.set(0.2837756259578247, {
      title: "Fahrradfreundlichere Landwehrstraße",
      text: `Um die Landwehrstraße fahrradfreundlicher zu gestalten, könnten folgende Maßnahmen in Angriff genommen werden:
      <ul>
      <li>Der Ausbau der Straße zu einer fahrradfreundlichen 30er Zone, um die Geschwindigkeit des Autoverkehrs zu reduzieren und die Sicherheit von Radfahrern zu erhöhen.</li>
      <li>Die Einrichtung von Fahrradspuren oder -wegen, um Radfahrern einen sicheren Bereich zu bieten.</li>
      <li>Der Bau von Fahrradboxen oder Abstellanlagen, um das Abstellen von Fahrrädern zu erleichtern.</li>
      <li>Die Installation von Verkehrsberuhigungsmaßnahmen, wie beispielsweise Verkehrsinseln, um den Verkehr zu verlangsamen und die Sicherheit zu erhöhen.</li>
      <li>Eine verbesserte Beleuchtung, um die Sichtbarkeit von Radfahrern bei Dunkelheit zu erhöhen.</li>
      <li>Die Durchführung von Verkehrsschulungen und -kampagnen, um das Bewusstsein für die Sicherheit von Radfahrern zu erhöhen und das Verhalten von Autofahrern zu verbessern.</li>
      </ul>
      Durch die Umsetzung dieser Maßnahmen könnte die Landwehrstraße sicherer und attraktiver für Radfahrer werden, was letztendlich dazu beitragen könnte, den Fahrradverkehr zu erhöhen und die Umweltbelastung zu reduzieren.`,
      author: "Stadt",
      time: 1671455978,
      votes: { likes: 0, dislikes: 0 },
      id: 0.2837756259578247,
      tags: [],
      comments: [],
      markerPoint: { lat: 49.87868070335318, lng: 8.640192425232668 },
      status: "idea",
      projectId: 1,
    });

    this.ideas.set(0.2837756259578277, {
      title: "Umgestaltung des Marktplatzes",
      text: "Eine Umgestaltung des Marktplatzes hin zu einer barrierefreien Umgebung ist wichtig, da dadurch alle Bürger, egal ob mit oder ohne Beeinträchtigung, gleichberechtigt an der Nutzung des Platzes teilhaben können.",
      author: "Stadt",
      time: 1676134963354,
      votes: { likes: 0, dislikes: 0 },
      id: 0.2837756259578277,
      tags: [],
      comments: [],
      markerPoint: { lat: 49.87298709873493, lng: 8.655710091419401 },
      status: "finished",
      projectId: 2,
    });
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_IDEA, (clientMsg) => {
      console.log(clientMsg);
      let idea = clientMsg.data;
      idea.time = Date.now();
      this.addIdea(idea);
      console.log(idea);
    });
    socket.on(EVENTS.CLIENT.REQUEST_IDEAS, () => {
      socket.emit(EVENTS.SERVER.SEND_IDEAS, { data: this.getIdeasInArray() });
    });
  }

  getIdeasInArray() {
    return Array.from(this.ideas.values());
  }

  addIdea(idea) {
    this.ideas.set(idea.id, idea);
    this.io.emit(EVENTS.SERVER.NEW_IDEA, { data: idea });
    console.log(idea);
  }
}
