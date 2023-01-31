new Vue({
  data: {
    movies: [],
    date: "",
    info: [],
  },

  methods: {
    descriptonClicked: function (index) {
      $("#exampleModal").on().modal({
        keyboard: false,
      });
      // movies에 저장된 movieCd를 불러옵니다.
      let movieCd = this.movies[index].movieCd;
      let key = "KobidKey";
      let url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json";
      axios({
        url,
        params: {
          key,
          movieCd,
        },
      })
        .then((data) => {
          let info = {
            movieNm: data.data.movieInfoResult.movieInfo.movieNm,
            director: data.data.movieInfoResult.movieInfo.directors[0].peopleNm,
            // 정보가 없으면 "정보가 없습니다."를 출력, 있으면 정보 출력
            actor:
              data.data.movieInfoResult.movieInfo.actors[0] === undefined
                ? "정보가 없습니다"
                : data.data.movieInfoResult.movieInfo.actors[0].peopleNm,
            showTm: data.data.movieInfoResult.movieInfo.showTm,
            nation: data.data.movieInfoResult.movieInfo.nations[0].nationNm,
            genre: data.data.movieInfoResult.movieInfo.genres[0].genreNm,
          };
          this.info = info;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.openModal = true;
    },
    // 삭제 버튼
    doRemove: function (index) {
      // 전달받은 인덱스 위치에서 한개 제거하기
      this.movies.splice(index, 1);
    },
    searchBtnClicked: function () {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = ("0" + (1 + myDate.getMonth())).slice(-2);
      var day = myDate.getDate() - 1;
      let today = year + month + day;

      let key = "KobidKey";
      let url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";

      // search Axios
      axios({
        url,
        method: "GET",
        params: {
          key,
          targetDt:
            // 검색창에 입력 없으면 어제 날짜, 날짜 지정하면 지정한 날짜 검색
            this.date.replace(/-/g, "") == "" ? today : this.date.replace(/-/g, ""),
        },
      })
        .then((result) => {
          const REST_API_KEY = "KakaoKey";
          let searchResult = result.data.boxOfficeResult.dailyBoxOfficeList;
          let movies = [];

          searchResult.forEach((e) => {
            let movie = {
              rank: e.rank,
              poster: "",
              movieNm: e.movieNm,
              audiCnt: e.audiCnt,
              openDt: e.openDt,
              movieCd: e.movieCd,
            };
            axios({
              async: true,
              headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`,
              },
              url: "https://dapi.kakao.com/v2/search/image",
              type: "GET",
              params: {
                query: e.movieNm + " 포스터",
              },
              dataType: "json",
            })
              .then(function (data) {
                console.log("이미지 성공");
                movie.poster = data.data.documents[0].thumbnail_url;
              })
              .catch(function (error) {
                console.log("이미지 실패!");
                console.log(error);
              });
            movies.push(movie);
          });

          console.log(this);
          this.movies = movies;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
}).$mount("#app");
